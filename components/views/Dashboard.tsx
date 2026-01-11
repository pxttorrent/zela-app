import React from 'react';
import { Flag } from 'lucide-react';
import { AdBox } from '../features/AdBox';
import { View, UserData, BabyData, TrackerLog, AdConfig, Challenge, UserVaccine, TrackerType, TrackerTypeConfig } from '../../types';
import { TrackerGrid } from '../dashboard/TrackerGrid';
import { LifeStageIndicator } from '../ui/LifeStageIndicator';
import { StatusCards } from '../dashboard/StatusCards';
import { DailyChallenges } from '../dashboard/DailyChallenges';
import { NextVaccineCard } from '../dashboard/NextVaccineCard';
import { Card } from '../ui/Card';

interface DashboardProps {
  user: UserData | null;
  baby: BabyData | null;
  trackers: TrackerLog[];
  trackerTypes?: TrackerTypeConfig[];
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
  baby,
  trackers, 
  trackerTypes = [],
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
      <div className="mb-6">
        {baby && <LifeStageIndicator baby={baby} />}
      </div>

      <TrackerGrid 
        trackerTypes={trackerTypes} 
        trackers={trackers} 
        onTrack={handleTracker} 
        lifeStage={babyLifeStage}
      />

      <StatusCards user={user} />
      
      {adConfig.enabled && (
        <AdBox config={adConfig} />
      )}

      <DailyChallenges challenges={dailyChallenges} onComplete={handleCompleteChallenge} />

      <NextVaccineCard nextVaccine={nextVaccine} setView={setView} />
    </>
  );
};
