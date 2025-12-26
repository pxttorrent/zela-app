import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { UserVaccine, View } from '../../types';
import { formatDate, differenceInDays, getTodayString } from '../../utils';

interface NextVaccineCardProps {
  nextVaccine: (UserVaccine & { name: string; description: string; dueDate: string }) | null;
  setView: (view: View) => void;
}

export const NextVaccineCard: React.FC<NextVaccineCardProps> = ({ nextVaccine, setView }) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Próxima Vacina</h2>
      <Card className="p-5 border-l-4 border-l-indigo-500">
        {nextVaccine ? (
          <>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-slate-900">{nextVaccine.name}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                differenceInDays(getTodayString(), nextVaccine.dueDate) > 0 
                  ? "bg-red-100 text-red-600" 
                  : "bg-indigo-50 text-indigo-600"
              }`}>
                {formatDate(nextVaccine.dueDate)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{nextVaccine.description}</p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setView('vaccines')}>
              Ver Carteirinha
            </Button>
          </>
        ) : (
          <div className="text-center text-slate-500 text-sm">Todas as vacinas em dia! 🎉</div>
        )}
      </Card>
    </section>
  );
};
