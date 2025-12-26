import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface RoutineQuestionnaireProps {
  onDone: () => void;
}

export const RoutineQuestionnaire: React.FC<RoutineQuestionnaireProps> = ({ onDone }) => {
  const [goal, setGoal] = useState('sono');
  const [time, setTime] = useState('30');
  const [days, setDays] = useState('7');

  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onDone(); }}>
      <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" value={goal} onChange={(e) => setGoal(e.target.value)}>
        <option value="sono">Melhorar o sono</option>
        <option value="colicas">Reduzir cólicas</option>
        <option value="amamentacao">Amamentação</option>
      </select>
      <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" value={time} onChange={(e) => setTime(e.target.value)}>
        <option value="15">15 min/dia</option>
        <option value="30">30 min/dia</option>
        <option value="60">60 min/dia</option>
      </select>
      <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" value={days} onChange={(e) => setDays(e.target.value)}>
        <option value="7">7 dias</option>
        <option value="14">14 dias</option>
        <option value="28">28 dias</option>
      </select>
      <Button className="w-full h-12">Gerar Rotina</Button>
    </form>
  );
};
