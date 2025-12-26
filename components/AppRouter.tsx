import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDashboardData } from '../hooks/useDashboardData';

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
    handlePartnerInvite
  } = useDashboardData(user);

  // Derived Data
  const babyAgeWeeks = baby ? differenceInWeeks(getTodayString(), baby.birthDate) : 0;

  // Challenges Logic
  const generateWeeklyChallenges = (week: number) => {
    const items = [
      { title: 'Olho no olho', description: 'Contato visual e sorriso', category: 'afeto', durationMinutes: 5 },
      { title: 'Tummy Time', description: 'Barriguinha para baixo', category: 'motor', durationMinutes: 2 },
      { title: 'Sons suaves', description: 'Acompanhar chocalho suave', category: 'cognitivo', durationMinutes: 3 },
      { title: 'Toque de carinho', description: 'Massagem suave nas perninhas', category: 'motor', durationMinutes: 5 },
      { title: 'Pele a pele', description: 'Contato próximo', category: 'afeto', durationMinutes: 5 },
      { title: 'Cuidado materno', description: 'Hidratar-se e respirar fundo', category: 'saude_mae', durationMinutes: 5 },
    ];
    return items.map((base, idx) => ({
      id: week * 10 + idx,
      title: base.title,
      description: base.description,
      category: base.category as any,
      minAgeWeeks: week,
      maxAgeWeeks: week,
      durationMinutes: base.durationMinutes,
      xpReward: xpByCategory[base.category as any]
    }));
  };

  const dailyChallenges = React.useMemo(() => {
    if (!baby) return [];
    const templates = generateWeeklyChallenges(babyAgeWeeks);
    const today = getTodayString();
    const completedTodayIds = userChallenges
      .filter(uc => uc.completedDate === today)
      .map(uc => uc.challengeId);
    const daySeed = new Date().getDate(); 
    const startIndex = daySeed % Math.max(1, templates.length - 2);
    return templates.slice(startIndex, startIndex + 3).map(c => ({
      ...c,
      isCompleted: completedTodayIds.includes(c.id)
    }));
  }, [baby, babyAgeWeeks, userChallenges, xpByCategory]);

  const nextVaccine = React.useMemo(() => {
    if (!baby || !userVaccines.length) return null;
    const pending = userVaccines
      .filter(v => v.status !== 'done')
      .map(v => {
        const t = VACCINES_DB.find(temp => temp.id === v.templateId);
        if (!t) return null;
        const dueDate = addDays(baby.birthDate, t.daysFromBirth);
        return { ...v, ...t, dueDate };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a!.dueDate).getTime() - new Date(b!.dueDate).getTime());
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
        logout
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
      element: <ProtectedRoute><Onboarding onComplete={() => window.location.href = '/dashboard'} /></ProtectedRoute>
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
