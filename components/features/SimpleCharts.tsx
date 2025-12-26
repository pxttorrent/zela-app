import React from 'react';
import { Card } from '../ui/Card';
import { TrackerLog, GrowthLog } from '../../types';
import { getTodayString } from '../../utils';

interface SimpleChartsProps {
  trackers: TrackerLog[];
  growthLogs: GrowthLog[];
}

export const SimpleCharts: React.FC<SimpleChartsProps> = ({ trackers, growthLogs }) => {
  const isSameDay = (ts: number) => new Date(ts).toDateString() === new Date().toDateString();
  const feedsToday = trackers.filter(t => (t.type === 'feed_left' || t.type === 'feed_right' || t.type === 'bottle') && isSameDay(t.timestamp)).length;
  const diapersToday = trackers.filter(t => t.type === 'diaper' && isSameDay(t.timestamp)).length;
  const lastGrowth = growthLogs[growthLogs.length - 1];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="text-xs text-slate-500">Mamadas/Hoje</div>
          <div className="text-3xl font-bold">{feedsToday}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">Fraldas/Hoje</div>
          <div className="text-3xl font-bold">{diapersToday}</div>
        </Card>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="text-xs text-slate-500 mb-2">Crescimento</div>
        <div className="flex items-end gap-6">
          <div className="flex-1">
            <div className="h-24 bg-rose-100 rounded-lg flex items-end">
              <div style={{ height: `${(lastGrowth?.weight ?? 3) * 10}px` }} className="w-6 bg-rose-500 rounded-lg mx-auto transition-all" />
            </div>
            <div className="text-center text-xs mt-1">Peso</div>
          </div>
          <div className="flex-1">
            <div className="h-24 bg-indigo-100 rounded-lg flex items-end">
              <div style={{ height: `${(lastGrowth?.height ?? 49) * 1}px` }} className="w-6 bg-indigo-500 rounded-lg mx-auto transition-all" />
            </div>
            <div className="text-center text-xs mt-1">Altura</div>
          </div>
        </div>
      </div>
    </div>
  );
};
