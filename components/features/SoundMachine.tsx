import React, { useState } from 'react';
import { Music, Play, Pause } from 'lucide-react';
import { Card } from '../ui/Card';

export const SoundMachine = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const sounds = [
    { id: 'white', name: 'Ruído Branco' },
    { id: 'rain', name: 'Chuva' },
    { id: 'womb', name: 'Útero' },
    { id: 'hair', name: 'Secador' },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-indigo-500" />
        <h3 className="font-bold text-slate-900">Para Dormir (Ruído Branco)</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sounds.map(sound => (
          <button
            key={sound.id}
            onClick={() => setPlaying(playing === sound.id ? null : sound.id)}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              playing === sound.id 
                ? 'bg-indigo-500 text-white border-indigo-500' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-xs font-medium">{sound.name}</span>
            {playing === sound.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
        ))}
      </div>
      {playing && (
        <div className="mt-3 text-[10px] text-center text-slate-400 animate-pulse">
          Reproduzindo áudio em loop... (Simulado)
        </div>
      )}
    </Card>
  );
};
