import React from 'react';
import { Clock, Star, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Challenge } from '../../types';
import { CATEGORY_LABELS } from '../../constants';

interface DailyChallengesProps {
  challenges: Challenge[];
  onComplete: (challengeId: number, xp: number) => void;
}

export const DailyChallenges: React.FC<DailyChallengesProps> = ({ challenges, onComplete }) => {
  return (
    <section>
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-slate-900">Missões de Hoje</h2>
        <Badge variant="neutral">{challenges.filter(c => c.isCompleted).length}/{challenges.length}</Badge>
      </div>
      <div className="space-y-4">
        {challenges.map(challenge => (
          <Card key={challenge.id} className={`overflow-hidden transition-all border-l-4 ${challenge.isCompleted ? 'border-l-emerald-500 bg-slate-50 opacity-80' : 'border-l-rose-500'}`}>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="uppercase text-[10px] tracking-wider mb-2">
                  {CATEGORY_LABELS[challenge.category]}
                </Badge>
                <div className="flex items-center text-slate-400 text-xs gap-1">
                  <Clock className="w-3 h-3" /> {challenge.durationMinutes} min
                </div>
              </div>
              <h3 className={`font-bold text-lg mb-1 ${challenge.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                {challenge.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {challenge.description}
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> +{challenge.xpReward} XP
                </span>
                <Button 
                  size="sm"
                  disabled={challenge.isCompleted}
                  onClick={() => onComplete(challenge.id, challenge.xpReward)}
                  className={challenge.isCompleted ? "bg-emerald-500 hover:bg-emerald-600 text-white w-24" : "w-24"}
                >
                  {challenge.isCompleted ? <Check className="w-4 h-4" /> : "Concluir"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
