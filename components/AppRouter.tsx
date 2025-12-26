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
import { differenceInWeeks, getTodayString, addDays } from '../utils';
import { VACCINES_DB } from '../constants';
import { 
  UserData, BabyData, TrackerLog, AdConfig, Challenge, 
  UserVaccine, GrowthLog, TrackerType 
} from '../types';

// Context Interface
interface AppContextType {
  user: UserData | null;
  baby: BabyData | null;
  trackers: TrackerLog[];
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
    allMissions
  } = useDashboardData(user);

  // Derived Data
  const babyAgeWeeks = baby ? differenceInWeeks(getTodayString(), baby.birthDate) : 0;

  // Challenges Logic
  const dailyChallenges = React.useMemo(() => {
    if (!baby || !allMissions.length) return [];
    
    // Filter applicable missions based on age
    const available = allMissions.filter(m => 
      babyAgeWeeks >= m.minAgeWeeks && 
      (m.maxAgeWeeks ? babyAgeWeeks <= m.maxAgeWeeks : true)
    );

    // If no missions for this exact week, show generic or closest ones
    // For now, we take 3 from the available pool based on day seed
    if (available.length === 0) return [];

    const today = getTodayString();
    const completedTodayIds = userChallenges
      .filter(uc => uc.completedDate === today)
      .map(uc => uc.challengeId);
      
    const daySeed = new Date().getDate(); 
    // Simple rotation logic
    const startIndex = daySeed % Math.max(1, available.length - 2);
    
    return available.slice(startIndex, startIndex + 3).map(c => ({
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
        user, baby, trackers, adConfig, dailyChallenges, nextVaccine,
        handleTracker: addTracker,
        handleCompleteChallenge: completeChallenge,
        growthLogs, addGrowthLog,
        userVaccines, toggleVaccine,
        setAdConfig, handlePartnerInvite,
        logout,
        allMissions
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
          <Onboarding onComplete={async (name, birthDate, gender) => {
            try {
              await api.saveBaby(name, birthDate, gender);
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
  return <Reports trackers={ctx.trackers} growthLogs={ctx.growthLogs} />;
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
