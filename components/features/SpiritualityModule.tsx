import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';

export const SpiritualityModule = () => {
  const [active, setActive] = useState(true);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">Ativar devocional</span>
        <input type="checkbox" checked={active} onChange={() => setActive(!active)} />
      </div>
      {active && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-sm">Reflexão do dia</span>
          </div>
          <div className="text-sm text-slate-700">“O amor é paciente, o amor é bondoso.”</div>
        </Card>
      )}
    </div>
  );
};
