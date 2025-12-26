import React from 'react';
import { formatTime } from '../../utils';

interface TrackerButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  lastTime: number | null;
}

export const TrackerButton: React.FC<TrackerButtonProps> = ({ icon: Icon, label, onClick, lastTime }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all h-24 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-1 text-rose-500">
      <Icon className="w-5 h-5" />
    </div>
    <span className="relative z-10 text-xs font-semibold text-slate-700">{label}</span>
    {lastTime && (
      <span className="relative z-10 text-[10px] text-slate-400 mt-1">{formatTime(lastTime)}</span>
    )}
  </button>
);
