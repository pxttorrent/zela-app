export type View = 'landing' | 'onboarding' | 'dashboard' | 'tools' | 'vaccines' | 'profile' | 'login' | 'signup' | 'reports' | 'routine' | 'community' | 'spirituality' | 'admin' | 'landingSales' | 'settings';

export type LifeStage = 'baby' | 'toddler' | 'kid' | 'teen';

export type ChallengeCategory = 
  | 'motor' | 'cognitivo' | 'nutricao' | 'sono' | 'afeto' | 'saude_mae'
  | 'autonomia' | 'social' | 'escola' | 'responsabilidade' 
  | 'comunicacao' | 'financeiro' | 'emocional';

export interface Challenge {
  id: number;
  title: string;
  description: string;
  category: ChallengeCategory;
  minAgeDays: number;      // NOVO: dias ao invés de semanas
  maxAgeDays: number;      // NOVO: dias ao invés de semanas
  lifeStage: LifeStage;    // NOVO
  minAgeWeeks?: number;    // Legacy
  maxAgeWeeks?: number;    // Legacy
  durationMinutes?: number;
  xpReward: number;
  isCompleted?: boolean;
}

export interface TrackerTypeConfig {
  code: string;
  label: string;
  icon: string;
  lifeStages: LifeStage[];
  sortOrder: number;
}

export interface MilestoneTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  minAgeDays: number;
  maxAgeDays: number;
  lifeStage: LifeStage;
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
  focusAreas?: string[];
  lifeStage?: LifeStage;  // NOVO: calculado no backend
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

// Manter TrackerType atualizado com todas as fases
export type TrackerType = 
  | 'feed' | 'sleep' | 'diaper' | 'bath' | 'tummy' | 'pump' | 'meds' | 'symptom'  // Baby
  | 'potty' | 'tantrum' | 'words' | 'meal'  // Toddler
  | 'homework' | 'chores' | 'activity' | 'screen' | 'reading'  // Kid
  | 'mood' | 'exercise' | 'social' | 'study';  // Teen

export type FeedType = 'feed_left' | 'feed_right' | 'bottle';

export interface TrackerLog {
  id: string;
  type: TrackerType;
  timestamp: number;
  subType?: FeedType;
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
