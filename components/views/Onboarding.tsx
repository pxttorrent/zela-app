import React, { useState } from 'react';
import { Target, Baby, Check, ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface OnboardingProps {
  onComplete: (name: string, birthDate: string, gender: any, focusAreas: string[]) => void;
}

const GOALS = [
  { id: 'sleep', label: 'Melhorar o Sono', icon: '💤' },
  { id: 'feeding', label: 'Alimentação', icon: '🍼' },
  { id: 'motor', label: 'Desenvolvimento Motor', icon: '🏃' },
  { id: 'speech', label: 'Fala e Comunicação', icon: '🗣️' },
  { id: 'health', label: 'Saúde e Vacinas', icon: '💉' },
  { id: 'behavior', label: 'Comportamento', icon: '😤' },
  { id: 'potty', label: 'Desfralde', icon: '🚽' },
  { id: 'routine', label: 'Rotina Diária', icon: '📅' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    birthDate: '',
    gender: 'boy' // default
  });
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (step === 1) {
      if (!data.name || !data.birthDate) return; // Simple validation
      setStep(2);
    } else {
      onComplete(data.name, data.birthDate, data.gender, selectedGoals);
    }
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 flex">
          <div 
            className="h-full bg-rose-500 transition-all duration-300 ease-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
              {step === 1 ? <Baby className="w-6 h-6" /> : <Target className="w-6 h-6" />}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {step === 1 ? 'Perfil do Bebê' : 'Seus Objetivos'}
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {step === 1 
                ? 'Vamos começar com o básico.' 
                : 'O que é prioridade para você agora?'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome do bebê</label>
                <input 
                  value={data.name}
                  onChange={e => setData({...data, name: e.target.value})}
                  required 
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" 
                  placeholder="Ex: Gabriel" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Data de Nascimento</label>
                <input 
                  type="date" 
                  value={data.birthDate}
                  onChange={e => setData({...data, birthDate: e.target.value})}
                  required 
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Gênero</label>
                <div className="flex gap-4">
                  {['boy', 'girl'].map((g) => (
                    <div 
                      key={g}
                      onClick={() => setData({...data, gender: g})}
                      className={`flex-1 cursor-pointer rounded-xl border-2 p-4 text-center text-sm font-medium transition-all ${
                        data.gender === g 
                          ? 'border-rose-500 bg-rose-50 text-rose-700' 
                          : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {g === 'boy' ? 'Menino' : 'Menina'}
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg mt-4">
                Próximo <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-rose-500">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-2xl mb-2">{goal.icon}</div>
                      <div className={`text-sm font-medium leading-tight ${isSelected ? 'text-rose-900' : 'text-slate-600'}`}>
                        {goal.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="h-14 px-6" onClick={() => setStep(1)}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button className="flex-1 h-14 text-lg" onClick={() => handleNext()}>
                  Finalizar Cadastro
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
