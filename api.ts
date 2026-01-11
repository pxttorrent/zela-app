import { AdConfig, Challenge, PushNotification, VaccineTemplate, UserData, BabyData, TrackerLog } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('zela_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options?.headers,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(
        res.status,
        data.error || `Request failed: ${res.status}`,
        data.details
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    // Network error
    throw new ApiError(0, 'Erro de conexão. Verifique sua internet.');
  }
}

// Interceptor para logout automático em 401
const requestWithAuthCheck = async <T>(url: string, options?: RequestInit): Promise<T> => {
  try {
    return await request<T>(url, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      localStorage.removeItem('zela_token');
      window.location.href = '/login';
    }
    throw error;
  }
};

// --- Auth ---
export const api = {
  auth: {
    signup: (data: any) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getProfile: () => requestWithAuthCheck<UserData>('/auth/me'),
  },

  dashboard: {
    getData: () => requestWithAuthCheck<any>('/data/dashboard'),
  },

  baby: {
    save: (data: BabyData) => requestWithAuthCheck<BabyData>('/data/baby', { method: 'POST', body: JSON.stringify(data) }),
  },

  trackers: {
    save: (data: any) => requestWithAuthCheck<TrackerLog>('/data/trackers', { method: 'POST', body: JSON.stringify(data) }),
  },

  challenges: {
    complete: (data: { challengeId: number, xp: number, babyId: string | number }) => 
      requestWithAuthCheck('/data/challenges', { method: 'POST', body: JSON.stringify(data) }),
  },
  
  milestones: {
    get: () => requestWithAuthCheck<{ templates: any[], achieved: any[] }>('/data/milestones'),
    save: (data: any) => requestWithAuthCheck('/data/milestones', { method: 'POST', body: JSON.stringify(data) }),
  },

  chat: {
    getHistory: () => requestWithAuthCheck<any[]>('/data/chat-history'),
    saveLog: (data: any) => requestWithAuthCheck('/data/chat-log', { method: 'POST', body: JSON.stringify(data) }),
  },

  admin: {
    getUsers: () => requestWithAuthCheck<UserData[]>('/admin/users'),
    getVaccines: () => requestWithAuthCheck<VaccineTemplate[]>('/admin/vaccines'),
    createVaccine: (data: any) => requestWithAuthCheck<VaccineTemplate>('/admin/vaccines', { method: 'POST', body: JSON.stringify(data) }),
    deleteVaccine: (id: number) => requestWithAuthCheck(`/admin/vaccines/${id}`, { method: 'DELETE' }),
    
    getMissions: () => requestWithAuthCheck<Challenge[]>('/admin/missions'),
    createMission: (data: any) => requestWithAuthCheck<Challenge>('/admin/missions', { method: 'POST', body: JSON.stringify(data) }),
    deleteMission: (id: number) => requestWithAuthCheck(`/admin/missions/${id}`, { method: 'DELETE' }),

    getAds: () => requestWithAuthCheck<AdConfig>('/admin/ads'),
    saveAds: (data: AdConfig) => requestWithAuthCheck<AdConfig>('/admin/ads', { method: 'POST', body: JSON.stringify(data) }),

    getPushHistory: () => requestWithAuthCheck<PushNotification[]>('/admin/push'),
    sendPush: (data: any) => requestWithAuthCheck<PushNotification>('/admin/push', { method: 'POST', body: JSON.stringify(data) }),
  }
};
