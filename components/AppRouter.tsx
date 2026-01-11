import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDashboardData } from '../hooks/useDashboardData';
import { api } from '../api';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Views
import { SalesLanding } from './SalesLanding';
import { Login } from './views/Login';
import { Signup } from './views/Signup';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { Tools } from './views/Tools';
import { Vaccines } from './views/Vaccines';
import { Profile } from './views/Profile';
import { Reports } from './views/Reports';
import { Routine } from './views/Routine';
import { Community } from './views/Community';
import { Spirituality } from './views/Spirituality';
import { AdminPanel } from './views/AdminPanel';
import { Settings as SettingsView } from './views/Settings';

// Types & Utils
import { differenceInWeeks, differenceInDays, getTodayString, addDays } from '../utils';
import { VACCINES_DB } from '../constants';
import { 
  UserData, BabyData, TrackerLog, AdConfig, Challenge, 
  UserVaccine, GrowthLog, TrackerType, TrackerTypeConfig
} from '../types';

// Context Interface
interface AppContextType {
  user: UserData | null;
  baby: BabyData | null;
  trackers: TrackerLog[];
  trackerTypes: TrackerTypeConfig[];
  adConfig: AdConfig;
  dailyChallenges: Challenge[];
  nextVaccine: (UserVaccine & { name: string; description: string; dueDate: string }) | null;
  handleTracker: (type: TrackerType) => Promise<void>;
  handleCompleteChallenge: (challengeId: number, xp: number) => Promise<void>;
  growthLogs: GrowthLog[];
  addGrowthLog: (weight: number, height: number) => void;
  userVaccines: UserVaccine[];
  toggleVaccine: (templateId: number) => void;
  setAdConfig: (config: AdConfig) => void;
  handlePartnerInvite: (email: string) => Promise<void>;
  logout: () => void;
  allMissions: Challenge[];
  babyLifeStage: 'baby' | 'toddler' | 'kid' | 'teen';
}

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-rose-500">Carregando...</div>;
  
  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && !user.is_admin && user.email !== 'admin@zela.com') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Data Wrapper for Dashboard & Features
const AppShell = () => {
  const { user, logout } = useAuth();
  const {
    baby,
    trackers, addTracker,
    growthLogs, addGrowthLog,
    userChallenges, completeChallenge,
    userVaccines, toggleVaccine,
    adConfig, setAdConfig,
    xpByCategory,
    handlePartnerInvite,
    allMissions,
    trackerTypes
  } = useDashboardData(user);

  // Derived Data
  const babyAgeWeeks = baby ? differenceInWeeks(getTodayString(), baby.birthDate) : 0;
  const babyAgeDays = baby ? differenceInDays(getTodayString(), baby.birthDate) : 0;
  
  const babyLifeStage = baby?.lifeStage || 'baby';

  // Challenges Logic
  const dailyChallenges = React.useMemo(() => {
    if (!baby || !allMissions.length) return [];
    
    // 1. Filter applicable missions based on age
    const available = allMissions.filter(m => 
      babyAgeDays >= (m.minAgeDays || 0) && 
      (m.maxAgeDays ? babyAgeDays <= m.maxAgeDays : true)
    );

    if (available.length === 0) return [];

    const today = getTodayString();
    const completedTodayIds = userChallenges
      .filter(uc => uc.completedDate === today)
      .map(uc => uc.challengeId);

    // 2. Separate by Priority (Focus Areas)
    const focusAreas = baby.focusAreas || [];
    const priorityMissions = available.filter(m => focusAreas.includes(m.category));
    const generalMissions = available.filter(m => !focusAreas.includes(m.category));

    // 3. Selection Logic (Rotate based on day)
    const daySeed = new Date().getDate(); // 1-31
    const totalToSelect = 3;
    const selection: Challenge[] = [];

    // Try to pick up to 2 priority missions
    if (priorityMissions.length > 0) {
      const priorityCount = Math.min(2, priorityMissions.length);
      const startIdx = daySeed % Math.max(1, priorityMissions.length);
      for (let i = 0; i < priorityCount; i++) {
        selection.push(priorityMissions[(startIdx + i) % priorityMissions.length]);
      }
    }

    // Fill the rest with general missions
    const remainingSlots = totalToSelect - selection.length;
    if (generalMissions.length > 0 && remainingSlots > 0) {
      const startIdx = daySeed % Math.max(1, generalMissions.length);
      for (let i = 0; i < remainingSlots; i++) {
        selection.push(generalMissions[(startIdx + i) % generalMissions.length]);
      }
    }

    // Fallback logic for edge cases (not enough missions total)
    // If selection is still empty (no general missions?), try to fill with more priority
    if (selection.length < totalToSelect && priorityMissions.length > selection.length) {
        const remainingPriority = priorityMissions.filter(p => !selection.find(s => s.id === p.id));
        selection.push(...remainingPriority.slice(0, totalToSelect - selection.length));
    }

    // Deduplicate just in case
    const uniqueSelection = Array.from(new Map(selection.map(item => [item.id, item])).values());

    return uniqueSelection.map(c => ({
      ...c,
      isCompleted: completedTodayIds.includes(c.id)
    }));
  }, [baby, babyAgeWeeks, userChallenges, allMissions]);

  const nextVaccine = React.useMemo(() => {
    if (!baby || !userVaccines.length) return null;
    
    // userVaccines is already populated with metadata from hook
    const pending = userVaccines
      .filter(v => v.status !== 'done')
      .map(v => {
        // v already has name, description, daysFromBirth from hook mapping
        const days = (v as any).daysFromBirth || 0;
        const dueDate = addDays(baby.birthDate, days);
        return { ...v, dueDate } as any;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
    return pending[0] || null;
  }, [baby, userVaccines]);

  return (
    <MainLayout 
      user={user} 
      baby={baby} 
      babyAgeWeeks={babyAgeWeeks}
    >
      <Outlet context={{
        user, baby, trackers, trackerTypes, adConfig, dailyChallenges, nextVaccine,
        handleTracker: addTracker,
        handleCompleteChallenge: completeChallenge,
        growthLogs, addGrowthLog,
        userVaccines, toggleVaccine,
        setAdConfig, handlePartnerInvite,
        logout,
        allMissions,
        babyLifeStage
      } satisfies AppContextType} />
    </MainLayout>
  );
};

export const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SalesLanding canContinue={false} onContinue={() => {}} onStartFree={() => {}} onSubscribe={() => {}} />,
    },
    {
      path: "/sales",
      element: <SalesLanding canContinue={false} onContinue={() => {}} onStartFree={() => {}} onSubscribe={() => {}} />
    },
    {
      path: "/login",
      element: <Login setView={() => {}} onLoginSuccess={() => {}} />
    },
    {
      path: "/signup",
      element: <Signup setView={() => {}} onSignupSuccess={() => {}} />
    },
    {
      path: "/onboarding",
      element: (
        <ProtectedRoute>
          <Onboarding onComplete={async (name, birthDate, gender, focusAreas) => {
            try {
              await api.baby.save({ name, birthDate, gender, focusAreas });
              window.location.href = '/dashboard';
            } catch (err) {
              console.error(err);
              alert('Erro ao salvar perfil do bebê. Tente novamente.');
            }
          }} />
        </ProtectedRoute>
      )
    },
    {
      element: <ProtectedRoute><AppShell /></ProtectedRoute>,
      children: [
        { path: "/dashboard", element: <DashboardWrapper /> },
        { path: "/tools", element: <ToolsWrapper /> },
        { path: "/vaccines", element: <VaccinesWrapper /> },
        { path: "/profile", element: <ProfileWrapper /> },
        { path: "/reports", element: <ReportsWrapper /> },
        { path: "/routine", element: <RoutineWrapper /> },
        { path: "/community", element: <CommunityWrapper /> },
        { path: "/spirituality", element: <SpiritualityWrapper /> },
        { path: "/settings", element: <SettingsWrapper /> },
      ]
    },
    {
      path: "/admin",
      element: <ProtectedRoute requireAdmin><AdminWrapper /></ProtectedRoute>
    }
  ]);

  return <RouterProvider router={router} />;
};

// --- Wrappers ---

const DashboardWrapper = () => {
  const ctx = useOutletContext<AppContextType>();
  return <Dashboard {...ctx} setView={() => {}} />;
};

const ToolsWrapper = () => {
  const ctx = useOutletContext<AppContextType>();
  return <Tools {...ctx} onAddGrowth={ctx.addGrowthLog} setView={() => {}} />;
};

const VaccinesWrapper = () => {
  const ctx = useOutletContext<AppContextType>();
  return <Vaccines userVaccines={ctx.userVaccines} onToggleVaccine={ctx.toggleVaccine} />;
};

const ProfileWrapper = () => {
  const ctx = useOutletContext<AppContextType>();
  return <Profile {...ctx} onPartnerInvite={ctx.handlePartnerInvite} onLogout={ctx.logout} setView={() => {}} />;
};

const ReportsWrapper = () => {
  const ctx = useOutletContext<AppContextType>();
  return <Reports trackers={ctx.trackers} growthLogs={ctx.growthLogs} baby={ctx.baby} />;
};

const RoutineWrapper = () => {
  return <Routine setView={() => {}} />;
};

const CommunityWrapper = () => <Community />;
const SpiritualityWrapper = () => <Spirituality />;

const SettingsWrapper = () => {
  const ctx = useOutletContext<AppContextType>();
  return <SettingsView adConfig={ctx.adConfig} setAdConfig={ctx.setAdConfig} setView={() => {}} />;
};

const AdminWrapper = () => {
  const { user, logout } = useAuth();
  return (
    <AdminLayout onLogout={logout}>
      <AdminPanel user={user} onLogout={logout} />
    </AdminLayout>
  );
};
