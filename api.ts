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

async function requestBlob(url: string, options?: RequestInit): Promise<Blob> {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options?.headers,
      },
    });

    if (!res.ok) {
       const data = await res.json().catch(() => ({}));
       throw new ApiError(
        res.status,
        data.error || `Request failed: ${res.status}`,
        data.details
      );
    }

    return await res.blob();
  } catch (error) {
    if (error instanceof ApiError) throw error;
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
    getContext: () => requestWithAuthCheck<{ context: any }>('/data/chat-context'),
  },

  reports: {
    getSummary: (babyId: string | number, month: number, year: number) => 
      requestWithAuthCheck<any>(`/data/reports/summary?babyId=${babyId}&month=${month}&year=${year}`),
    export: (babyId: string | number, format: 'csv' | 'json') => 
      requestBlob(`/data/reports/export?babyId=${babyId}&format=${format}`, {
        headers: { 'Accept': format === 'csv' ? 'text/csv' : 'application/json' }
      }),
  },

  notifications: {
    getPreferences: () => requestWithAuthCheck<any[]>('/notifications/preferences'),
    updatePreferences: (data: any) => requestWithAuthCheck('/notifications/preferences', { method: 'PUT', body: JSON.stringify(data) }),
    getUpcoming: () => requestWithAuthCheck<any[]>('/notifications/upcoming'),
  },

  partner: {
    invite: (email: string, babyId: string | number) => 
      requestWithAuthCheck<{ success: true, inviteCode: string }>('/partner/invite', { method: 'POST', body: JSON.stringify({ email, babyId }) }),
    accept: (inviteCode: string) => 
      requestWithAuthCheck('/partner/accept', { method: 'POST', body: JSON.stringify({ inviteCode }) }),
    getCaretakers: (babyId: string | number) => requestWithAuthCheck<any[]>(`/partner/caretakers/${babyId}`),
    removeCaretaker: (babyId: string | number, userId: string | number) => 
      requestWithAuthCheck(`/partner/caretakers/${babyId}/${userId}`, { method: 'DELETE' }),
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
