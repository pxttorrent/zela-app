import { AdConfig, Challenge, PushNotification, VaccineTemplate, UserData, BabyData, TrackerLog } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const getHeaders = () => {
  const token = localStorage.getItem('zela_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

interface AuthResponse {
  user: UserData;
  token: string;
}

interface DashboardResponse {
  baby: BabyData | null;
  trackers: any[]; // The raw DB shape might differ slightly from frontend TrackerLog, but let's assume close enough or map later
  recentChallenges: any[];
  adConfig: AdConfig;
  missions: Challenge[];
  vaccines: VaccineTemplate[];
}

export const api = {
  async signup(name: string, email: string, password: string) {
    return request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login(email: string, password: string) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(token: string) {
    // Special case: we might want to pass token explicitly if not in localStorage yet, 
    // but usually getMe is called with stored token. 
    // The existing code passed token as arg. Let's support that via headers override.
    return request<{ user: UserData }>('/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  // --- DATA ---
  async getDashboard() {
    return request<DashboardResponse>('/data/dashboard');
  },

  async saveBaby(name: string, birthDate: string, gender: string) {
    return request<BabyData>('/data/baby', {
      method: 'POST',
      body: JSON.stringify({ name, birthDate, gender }),
    });
  },

  async addTracker(type: string, timestamp: number, babyId: string | number) {
    return request<TrackerLog>('/data/trackers', {
      method: 'POST',
      body: JSON.stringify({ type, timestamp, babyId }),
    });
  },

  async completeChallenge(challengeId: number, xp: number, babyId: string | number) {
    return request<{ success: boolean }>('/data/challenges', {
      method: 'POST',
      body: JSON.stringify({ challengeId, xp, babyId }),
    });
  },

  // --- ADMIN ---
  admin: {
    async getUsers() {
      return request<UserData[]>('/admin/users');
    },
    
    async getVaccines() {
      return request<VaccineTemplate[]>('/admin/vaccines');
    },
    async createVaccine(data: Omit<VaccineTemplate, 'id'>) {
      return request<VaccineTemplate>('/admin/vaccines', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async deleteVaccine(id: number) {
      return request<{ success: boolean }>(`/admin/vaccines/${id}`, {
        method: 'DELETE',
      });
    },

    async getMissions() {
      return request<Challenge[]>('/admin/missions');
    },
    async createMission(data: Omit<Challenge, 'id'>) {
      return request<Challenge>('/admin/missions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async deleteMission(id: number) {
      return request<{ success: boolean }>(`/admin/missions/${id}`, {
        method: 'DELETE',
      });
    },

    async getAdConfig() {
      return request<AdConfig>('/admin/ads');
    },
    async updateAdConfig(config: AdConfig) {
      return request<AdConfig>('/admin/ads', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    },

    async getPushHistory() {
      return request<PushNotification[]>('/admin/push');
    },
    async sendPush(data: Omit<PushNotification, 'id' | 'sentAt'>) {
      return request<{ success: boolean }>('/admin/push', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  }
};
