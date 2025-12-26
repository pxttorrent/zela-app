import React from 'react';
import { Card } from '../ui/Card';
import { RoutineQuestionnaire } from '../features/RoutineQuestionnaire';
import { View } from '../../types';

interface RoutineProps {
  setView: (view: View) => void;
}

export const Routine: React.FC<RoutineProps> = ({ setView }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="font-bold">Questionário</h2>
        <RoutineQuestionnaire onDone={() => setView('dashboard')} />
      </Card>
    </div>
  );
};
