import React from 'react';
import { Star, Flame } from 'lucide-react';
import { Card } from '../ui/Card';
import { UserData } from '../../types';

interface StatusCardsProps {
  user: UserData | null;
}

export const StatusCards: React.FC<StatusCardsProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4 flex flex-col items-center justify-center py-6">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-2xl">
          <Star className="fill-current w-6 h-6" />
          {user?.points || 0}
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Pontos</span>
      </Card>
      <Card className="p-4 flex flex-col items-center justify-center py-6">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-2xl">
          <Flame className="fill-current w-6 h-6" />
          {user?.streak || 0}
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Dias Seguidos</span>
      </Card>
    </div>
  );
};
