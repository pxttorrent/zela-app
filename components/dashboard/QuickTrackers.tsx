import React from 'react';
import { Milk, Moon } from 'lucide-react';
import { TrackerButton } from '../features/TrackerButton';
import { TrackerLog, TrackerType } from '../../types';

interface QuickTrackersProps {
  trackers: TrackerLog[];
  handleTracker: (type: TrackerType) => void;
}

export const QuickTrackers: React.FC<QuickTrackersProps> = ({ trackers, handleTracker }) => {
  const getLastTrackerTime = (type: TrackerType) => {
    const log = trackers.find(t => t.type === type);
    return log ? log.timestamp : null;
  };

  return (
    <div className="grid grid-cols-4 gap-3">
       <TrackerButton 
          icon={Milk} 
          label="Esq" 
          onClick={() => handleTracker('feed_left')} 
          lastTime={getLastTrackerTime('feed_left')} 
       />
       <TrackerButton 
          icon={Milk} 
          label="Dir" 
          onClick={() => handleTracker('feed_right')} 
          lastTime={getLastTrackerTime('feed_right')} 
       />
       <TrackerButton 
          icon={Moon} 
          label="Fralda" 
          onClick={() => handleTracker('diaper')} 
          lastTime={getLastTrackerTime('diaper')} 
       />
       <TrackerButton 
          icon={Moon} 
          label="Sono" 
          onClick={() => handleTracker('sleep')} 
          lastTime={getLastTrackerTime('sleep')} 
       />
    </div>
  );
};
