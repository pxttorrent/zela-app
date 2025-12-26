import React from 'react';
import { Card } from '../ui/Card';
import { SimpleCharts } from '../features/SimpleCharts';
import { TrackerLog, GrowthLog } from '../../types';

interface ReportsProps {
  trackers: TrackerLog[];
  growthLogs: GrowthLog[];
}

export const Reports: React.FC<ReportsProps> = ({ trackers, growthLogs }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-bold mb-4">Cuidado do Bebê</h2>
        <SimpleCharts trackers={trackers} growthLogs={growthLogs} />
      </Card>
    </div>
  );
};
