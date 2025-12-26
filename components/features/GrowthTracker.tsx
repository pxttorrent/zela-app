import React, { useState } from 'react';
import { Activity, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GrowthLog } from '../../types';

interface GrowthTrackerProps {
  logs: GrowthLog[];
  onAdd: (weight: number, height: number) => void;
}

export const GrowthTracker: React.FC<GrowthTrackerProps> = ({ logs, onAdd }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  const lastLog = logs[logs.length - 1];

  // Simple SVG chart logic
  const width = 300;
  const heightPx = 100;
  const points = logs.map((log, i) => {
    const x = (i / (logs.length || 1)) * width;
    // Normalize weight roughly between 2kg and 10kg for scale
    const y = heightPx - ((log.weight - 2) / 8) * heightPx; 
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-emerald-500" />
        <h3 className="font-bold text-slate-900">Curva de Crescimento</h3>
      </div>

      {logs.length > 1 && (
        <div className="mb-6 border-b border-slate-100 pb-4">
           <svg width="100%" height={heightPx} className="overflow-visible">
             <polyline 
               points={points} 
               fill="none" 
               stroke="#10b981" 
               strokeWidth="3" 
               strokeLinecap="round"
             />
             {logs.map((_, i) => (
                <circle key={i} cx={(i / logs.length) * width} cy={heightPx - ((logs[i].weight - 2) / 8) * heightPx} r="4" fill="white" stroke="#10b981" strokeWidth="2" />
             ))}
           </svg>
           <div className="flex justify-between text-[10px] text-slate-400 mt-2">
             <span>Nascer</span>
             <span>Hoje</span>
           </div>
        </div>
      )}

      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400">Peso (kg)</label>
          <input 
            type="number" 
            value={weight} 
            onChange={e => setWeight(e.target.value)}
            placeholder={lastLog ? String(lastLog.weight) : "0.0"}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400">Altura (cm)</label>
          <input 
             type="number"
             value={height}
             onChange={e => setHeight(e.target.value)}
             placeholder={lastLog ? String(lastLog.height) : "0.0"}
             className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <Button 
          onClick={() => {
            if (weight && height) {
              onAdd(Number(weight), Number(height));
              setWeight('');
              setHeight('');
            }
          }}
          className="h-10 w-10 p-0 rounded-lg bg-slate-900 hover:bg-slate-800"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};
