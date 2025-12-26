import React from 'react';
import { Flag } from 'lucide-react';
import { AdBox } from '../features/AdBox';
import { View, UserData, BabyData, TrackerLog, AdConfig, Challenge, UserVaccine, TrackerType } from '../../types';
import { QuickTrackers } from '../dashboard/QuickTrackers';
import { StatusCards } from '../dashboard/StatusCards';
import { DailyChallenges } from '../dashboard/DailyChallenges';
import { NextVaccineCard } from '../dashboard/NextVaccineCard';
import { Card } from '../ui/Card';

interface DashboardProps {
  user: UserData | null;
  baby: BabyData | null;
  trackers: TrackerLog[];
  adConfig: AdConfig;
  dailyChallenges: Challenge[];
  nextVaccine: (UserVaccine & { name: string; description: string; dueDate: string }) | null;
  handleTracker: (type: TrackerType) => void;
  handleCompleteChallenge: (challengeId: number, xp: number) => void;
  setView: (view: View) => void;
  babyLifeStage?: 'baby' | 'toddler' | 'kid' | 'teen';
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  trackers, 
  adConfig, 
  dailyChallenges, 
  nextVaccine, 
  handleTracker, 
  handleCompleteChallenge, 
  setView,
  babyLifeStage = 'baby'
}) => {
  return (
    <>
      {babyLifeStage !== 'baby' && (
        <Card className="p-4 bg-indigo-50 border-indigo-200 mb-6">
          <div className="flex items-center gap-3">
             <Flag className="w-6 h-6 text-indigo-500" />
             <div>
               <h3 className="font-bold text-indigo-900 capitalize">
                 Fase Atual: {babyLifeStage === 'toddler' ? 'Primeiros Passos (1-3 anos)' : babyLifeStage === 'kid' ? 'Infância (3-12 anos)' : 'Adolescência (12+)'}
               </h3>
               <p className="text-xs text-indigo-700">Acompanhe os novos marcos de desenvolvimento específicos para esta idade.</p>
             </div>
          </div>
        </Card>
      )}

      <QuickTrackers trackers={trackers} handleTracker={handleTracker} />


      <StatusCards user={user} />
      
      {adConfig.enabled && (
        <AdBox config={adConfig} />
      )}

      <DailyChallenges challenges={dailyChallenges} onComplete={handleCompleteChallenge} />

      <NextVaccineCard nextVaccine={nextVaccine} setView={setView} />
    </>
  );
};
