const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const getHeaders = () => {
  const token = localStorage.getItem('zela_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const api = {
  async signup(name: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Signup failed');
    }
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async getMe(token: string) {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Invalid token');
    return res.json();
  },

  // --- DATA ---
  async getDashboard() {
    const res = await fetch(`${API_URL}/data/dashboard`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load dashboard');
    return res.json();
  },

  async saveBaby(name: string, birthDate: string, gender: string) {
    const res = await fetch(`${API_URL}/data/baby`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, birthDate, gender }),
    });
    if (!res.ok) throw new Error('Failed to save baby');
    return res.json();
  },

  async addTracker(type: string, timestamp: number, babyId: string) {
    const res = await fetch(`${API_URL}/data/trackers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type, timestamp, babyId }),
    });
    if (!res.ok) throw new Error('Failed to add tracker');
    return res.json();
  },

  async completeChallenge(challengeId: number, xp: number, babyId: string) {
    const res = await fetch(`${API_URL}/data/challenges`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ challengeId, xp, babyId }),
    });
    if (!res.ok) throw new Error('Failed to complete challenge');
    return res.json();
  },

  // --- ADMIN ---
  admin: {
    async getUsers() {
      const res = await fetch(`${API_URL}/admin/users`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    
    async getVaccines() {
      const res = await fetch(`${API_URL}/admin/vaccines`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch vaccines');
      return res.json();
    },
    async createVaccine(data: any) {
      const res = await fetch(`${API_URL}/admin/vaccines`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create vaccine');
      return res.json();
    },
    async deleteVaccine(id: number) {
      const res = await fetch(`${API_URL}/admin/vaccines/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete vaccine');
      return res.json();
    },

    async getMissions() {
      const res = await fetch(`${API_URL}/admin/missions`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch missions');
      return res.json();
    },
    async createMission(data: any) {
      const res = await fetch(`${API_URL}/admin/missions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create mission');
      return res.json();
    },
    async deleteMission(id: number) {
      const res = await fetch(`${API_URL}/admin/missions/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete mission');
      return res.json();
    },

    async getAdConfig() {
      const res = await fetch(`${API_URL}/admin/ads`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch ads config');
      return res.json();
    },
    async updateAdConfig(config: any) {
      const res = await fetch(`${API_URL}/admin/ads`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to update ads config');
      return res.json();
    },

    async getPushHistory() {
      const res = await fetch(`${API_URL}/admin/push`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch push history');
      return res.json();
    },
    async sendPush(data: any) {
      const res = await fetch(`${API_URL}/admin/push`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send push');
      return res.json();
    },
  }
};
