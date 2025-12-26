import React from 'react';
import { LogIn } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { View, UserData } from '../../types';
import { api } from '../../api';

interface LoginProps {
  setView: (view: View) => void;
  onLoginSuccess: (user: UserData) => void;
}

export const Login: React.FC<LoginProps> = ({ setView, onLoginSuccess }) => {
  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const { user, token } = await api.login(formData.get('email') as string, formData.get('password') as string);
      localStorage.setItem('zela_token', token);
      onLoginSuccess(user);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-6 space-y-4">
          <div className="text-center">
            <LogIn className="w-6 h-6 text-rose-500 mx-auto mb-2" />
            <h2 className="font-bold">Entrar no Zela</h2>
          </div>
          <form className="space-y-3" onSubmit={handleAuthLogin}>
            <input name="email" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Email" type="email" required />
            <input name="password" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Senha" type="password" required />
            <Button className="w-full h-12">Entrar</Button>
          </form>
          <Button variant="outline" className="w-full h-12" onClick={() => setView('landingSales')}>
            Voltar
          </Button>
          <div className="text-center text-xs mt-2">
             Não tem conta? <span className="text-rose-500 font-bold cursor-pointer" onClick={() => setView('signup')}>Cadastre-se</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
