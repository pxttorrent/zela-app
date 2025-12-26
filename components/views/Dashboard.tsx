import React from 'react';
import { AdBox } from '../features/AdBox';
import { View, UserData, BabyData, TrackerLog, AdConfig, Challenge, UserVaccine, TrackerType } from '../../types';
import { QuickTrackers } from '../dashboard/QuickTrackers';
import { StatusCards } from '../dashboard/StatusCards';
import { DailyChallenges } from '../dashboard/DailyChallenges';
import { NextVaccineCard } from '../dashboard/NextVaccineCard';

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
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  trackers, 
  adConfig, 
  dailyChallenges, 
  nextVaccine, 
  handleTracker, 
  handleCompleteChallenge, 
  setView 
}) => {
  return (
    <>
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
