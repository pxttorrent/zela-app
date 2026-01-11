import React from 'react';
import { TrackerType, TrackerLog, TrackerTypeConfig } from '../../types';
import { TrackerButton } from '../features/TrackerButton';
import * as LucideIcons from 'lucide-react';

interface Props {
  trackerTypes: TrackerTypeConfig[];
  trackers: TrackerLog[];
  onTrack: (type: TrackerType) => void;
  lifeStage: string;
}

export const TrackerGrid: React.FC<Props> = ({ trackerTypes, trackers, onTrack, lifeStage }) => {
  const getLastTime = (code: string) => {
    const log = trackers.find(t => t.type === code);
    return log ? log.timestamp : null;
  };

  const filtered = trackerTypes.filter(t => t.lifeStages.includes(lifeStage as any)).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="grid grid-cols-4 gap-3">
      {filtered.map(t => {
        const isEmoji = /\p{Extended_Pictographic}/u.test(t.icon);
        
        let IconComponent: React.ElementType;

        if (isEmoji) {
          IconComponent = (props: any) => <span className={props.className} style={{ fontSize: '1.25rem', lineHeight: '1' }}>{t.icon}</span>;
        } else {
          // Fallback to Lucide if name matches, or Circle
          IconComponent = (LucideIcons as any)[t.icon] || LucideIcons.Circle;
        }
        
        return (
          <TrackerButton
            key={t.code}
            icon={IconComponent}
            label={t.label}
            onClick={() => onTrack(t.code as TrackerType)}
            lastTime={getLastTime(t.code)}
          />
        );
      })}
    </div>
  );
};
