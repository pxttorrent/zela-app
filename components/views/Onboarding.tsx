import React from 'react';
import { Button } from '../ui/Button';

interface OnboardingProps {
  onComplete: (name: string, birthDate: string, gender: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo ao Zela</h1>
          <p className="text-slate-500 mt-2 text-sm">Vamos configurar o perfil do seu bebê.</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onComplete(
            formData.get('name') as string,
            formData.get('birthDate') as string,
            formData.get('gender')
          );
        }} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nome do bebê</label>
            <input name="name" required className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Ex: Gabriel" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Data de Nascimento</label>
            <input name="birthDate" type="date" required className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Gênero</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="gender" value="boy" className="peer sr-only" />
                <div className="rounded-xl border-2 border-slate-100 peer-checked:border-rose-500 peer-checked:bg-rose-50 p-4 text-center text-sm font-medium hover:bg-slate-50 transition-all">
                  Menino
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="gender" value="girl" className="peer sr-only" />
                <div className="rounded-xl border-2 border-slate-100 peer-checked:border-rose-500 peer-checked:bg-rose-50 p-4 text-center text-sm font-medium hover:bg-slate-50 transition-all">
                  Menina
                </div>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 text-lg">
            Continuar
          </Button>
        </form>
      </div>
    </div>
  );
};
