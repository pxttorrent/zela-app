import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { 
  BabyData, TrackerLog, UserChallenge, UserVaccine, 
  GrowthLog, AdConfig, ChallengeCategory, TrackerType, UserData 
} from '../types';
import { getTodayString } from '../utils';

export const useDashboardData = (user: UserData | null) => {
  const queryClient = useQueryClient();
  const [xpByCategory] = useState<Record<ChallengeCategory, number>>({
    afeto: 15, motor: 15, cognitivo: 15, nutricao: 15, sono: 15, saude_mae: 50
  });

  // Local state for items not yet in DB or fully synced
  const [growthLogs, setGrowthLogs] = useState<GrowthLog[]>([]);
  const [userVaccines, setUserVaccines] = useState<UserVaccine[]>([]);

  // --- QUERY: Dashboard Data ---
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: () => api.dashboard.getData(),
    enabled: !!user && !user.is_admin,
  });

  // Effect to sync vaccines from server templates
  useEffect(() => {
    if (dashboardData?.vaccines) {
      setUserVaccines(prev => {
        const existingStatus = new Map<number, UserVaccine>(prev.map(v => [v.templateId, v]));
        
        return dashboardData.vaccines.map((t: any) => {
          const existing = existingStatus.get(t.id);
          return {
            templateId: t.id,
            status: existing ? existing.status : 'pending',
            takenAt: existing ? existing.takenAt : null,
            // Extra fields for UI rendering
            name: t.name,
            description: t.description,
            daysFromBirth: t.days_from_birth || t.daysFromBirth
          } as unknown as UserVaccine; 
        });
      });
    }
  }, [dashboardData?.vaccines]);

  // Derived State from Query Data
  const baby: BabyData | null = dashboardData?.baby ? {
    id: dashboardData.baby.id,
    name: dashboardData.baby.name,
    birthDate: dashboardData.baby.birthDate,
    gender: dashboardData.baby.gender,
    lifeStage: dashboardData.baby.life_stage || 'baby'
  } : null;

  const trackers: TrackerLog[] = dashboardData?.trackers ? dashboardData.trackers.map((t: { id: string; type: string; timestamp: string | number }) => ({
    id: t.id,
    type: t.type as TrackerType,
    timestamp: new Date(t.timestamp).getTime()
  })) : [];

  const userChallenges: UserChallenge[] = dashboardData?.recentChallenges ? dashboardData.recentChallenges.map((c: { template_id: number; completed_at: string }) => ({
    challengeId: c.template_id,
    completedDate: c.completed_at
  })) : [];

  const adConfig: AdConfig = dashboardData?.adConfig || { enabled: false, clientId: '', slots: { dashboard: '' } };
  const allMissions = dashboardData?.missions || [];
  const trackerTypes = dashboardData?.trackerTypes || [];

  // --- MUTATIONS ---

  const addTrackerMutation = useMutation({
    mutationFn: async (type: TrackerType) => {
      if (!baby?.id) throw new Error("No baby selected");
      return api.trackers.save({ type, timestamp: Date.now(), babyId: baby.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const completeChallengeMutation = useMutation({
    mutationFn: async ({ challengeId, xp }: { challengeId: number, xp: number }) => {
      if (!baby?.id) throw new Error("No baby selected");
      return api.challenges.complete({ challengeId, xp, babyId: baby.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  // --- ACTIONS ---

  const addTracker = async (type: TrackerType) => {
    // Optimistic update could be added here, but for now we rely on invalidation
    await addTrackerMutation.mutateAsync(type);
  };

  const completeChallenge = async (challengeId: number, xp: number) => {
    await completeChallengeMutation.mutateAsync({ challengeId, xp });
  };

  const addGrowthLog = (weight: number, height: number) => {
    const newLog: GrowthLog = { date: getTodayString(), weight, height };
    setGrowthLogs(prev => [...prev, newLog].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    // TODO: Add API mutation
  };

  const toggleVaccine = (templateId: number) => {
    setUserVaccines(prev => prev.map(v => {
      if (v.templateId === templateId) {
        return {
          ...v,
          status: v.status === 'done' ? 'pending' : 'done',
          takenAt: v.status === 'done' ? null : getTodayString()
        } as UserVaccine;
      }
      return v;
    }));
    // TODO: Add API mutation
  };

  const setAdConfig = (config: AdConfig) => {
    // This is effectively read-only from dashboard, but if we need local override:
    // setAdConfigState(config);
    // For now, assume it comes from server
  };

  const handlePartnerInvite = async (email: string) => {
    console.log('Inviting partner:', email);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert(`Convite enviado para ${email}! (Simulação)`);
  };

  return {
    baby, 
    setBaby: () => {}, // Deprecated/Managed by Query
    trackers, 
    addTracker,
    growthLogs, 
    addGrowthLog,
    userChallenges, 
    completeChallenge,
    userVaccines, 
    setUserVaccines, 
    toggleVaccine,
    adConfig, 
    setAdConfig,
    xpByCategory,
    allMissions,
    trackerTypes,
    loadDashboard: async () => { await queryClient.invalidateQueries({ queryKey: ['dashboard'] }) },
    clearData: () => queryClient.clear(),
    handlePartnerInvite
  };
};
