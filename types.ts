export type View = 'landing' | 'onboarding' | 'dashboard' | 'tools' | 'vaccines' | 'profile' | 'login' | 'signup' | 'reports' | 'routine' | 'community' | 'spirituality' | 'admin' | 'landingSales' | 'settings';

export type ChallengeCategory = 'motor' | 'cognitivo' | 'nutricao' | 'sono' | 'afeto' | 'saude_mae';

export interface Challenge {
  id: number;
  title: string;
  description: string;
  category: ChallengeCategory;
  minAgeWeeks: number;
  maxAgeWeeks: number;
  durationMinutes: number;
  xpReward: number;
  isCompleted?: boolean;
}

export interface VaccineTemplate {
  id: number;
  name: string;
  description: string;
  daysFromBirth: number;
}

export interface UserData {
  id?: number | string;
  name: string;
  email: string;
  isOnboarded: boolean;
  points: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  partnerName?: string; // For Duo Mode
  is_admin?: boolean;
}

export interface BabyData {
  id?: number | string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'boy' | 'girl' | null;
  focusAreas?: string[]; // Array de categorias selecionadas (ex: ['sleep', 'motor'])
}

export interface UserChallenge {
  challengeId: number;
  completedDate: string;
}

export interface UserVaccine {
  templateId: number;
  takenAt: string | null;
  status: 'pending' | 'done' | 'delayed';
  name?: string;
  description?: string;
  dueDate?: string;
  daysFromBirth?: number;
}

export type TrackerType = 'feed_left' | 'feed_right' | 'bottle' | 'diaper' | 'sleep' | 'bath';

export interface TrackerLog {
  id: string;
  type: TrackerType;
  timestamp: number; // Date.now()
}

export interface GrowthLog {
  date: string;
  weight: number; // kg
  height: number; // cm
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface AdConfig {
  enabled: boolean;
  clientId: string; // ca-pub-XXXXXXXXXXXXXXXX
  slots: {
    dashboard: string; // Slot ID for dashboard banner
  };
}

export interface PushNotification {
  id: number;
  title: string;
  body: string;
  sentAt: string;
  audience: string;
}
