import React from 'react';
import { Heart, Trophy, ShieldCheck, Music, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { View } from '../../types';

interface LandingProps {
  setView: (view: View) => void;
}

export const Landing: React.FC<LandingProps> = ({ setView }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 text-center space-y-6 z-10">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          ZELA
        </h1>
        <p className="text-xl text-slate-600 font-medium leading-relaxed">
          O "Canivete Suíço" para pais de primeira viagem.
        </p>
        
        <div className="grid grid-cols-2 gap-3 w-full mt-8">
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-700">Desafios</span>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-700">Vacinas</span>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <Music className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-700">Ruído Branco</span>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <MessageCircle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-700">IA Pediatra</span>
           </div>
        </div>
        <div className="w-full mt-6">
          <Button className="w-full h-12" onClick={() => setView('login')}>Entrar</Button>
        </div>
        <div className="w-full">
          <Button variant="outline" className="w-full h-12 mt-2" onClick={() => setView('landingSales')}>Conheça o Zela</Button>
        </div>
      </div>
      
      <div className="p-8 pb-12 mt-auto bg-white border-t border-slate-50">
        <Button onClick={() => setView('signup')} size="lg" className="w-full text-lg shadow-xl shadow-rose-200 bg-gradient-to-r from-rose-500 to-rose-600">
          Começar Agora
        </Button>
        <p className="text-center text-xs text-slate-400 mt-4">
          Simulação de PWA • Versão Completa
        </p>
      </div>
    </div>
  );
};
