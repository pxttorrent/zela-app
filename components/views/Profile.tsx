import React, { useState } from 'react';
import { Users, Baby, ChevronRight, LogOut } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { View, UserData, BabyData } from '../../types';
import { formatDate } from '../../utils';

interface ProfileProps {
  user: UserData | null;
  baby: BabyData | null;
  setView: (view: View) => void;
  onLogout: () => void;
  onPartnerInvite: (email: string) => Promise<void>;
}

export const Profile: React.FC<ProfileProps> = ({ user, baby, setView, onLogout, onPartnerInvite }) => {
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    try {
        await onPartnerInvite(inviteEmail);
        setShowInviteInput(false);
        setInviteEmail('');
        alert('Convite criado! O código foi gerado.'); 
        // Note: In a real app we would show the code or email it. 
        // The API returns the code, but the hook might not expose it directly via handlePartnerInvite unless we change it.
        // For now assume the hook handles the success message or we rely on the alert.
    } catch (e) {
        console.error(e);
        alert('Erro ao enviar convite.');
    }
    setInviting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-2xl font-bold text-rose-500">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      {/* Duo Mode (Pain point: Couple Sync) */}
      <Card className="bg-indigo-50 border-indigo-100">
        <div className="p-4">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-500">
                 <Users className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="font-bold text-indigo-900">Modo Dupla</h3>
                 <p className="text-xs text-indigo-600">
                   {user?.partnerName 
                     ? `Sincronizado com ${user.partnerName}` 
                     : "Convide seu parceiro(a)"}
                 </p>
               </div>
             </div>
             {!user?.partnerName && !showInviteInput && (
               <Button size="sm" className="h-8 bg-indigo-500 hover:bg-indigo-600 text-xs" onClick={() => setShowInviteInput(true)}>
                 Convidar
               </Button>
             )}
           </div>
           
           {showInviteInput && (
             <div className="mt-3 bg-white p-3 rounded-lg border border-indigo-100">
               <p className="text-xs text-slate-500 mb-2">Digite o email do parceiro para gerar um código de convite:</p>
               <div className="flex gap-2">
                 <input 
                   className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                   placeholder="Email do parceiro"
                   value={inviteEmail}
                   onChange={e => setInviteEmail(e.target.value)}
                 />
                 <Button size="sm" onClick={handleInvite} disabled={inviting} className="bg-indigo-500 hover:bg-indigo-600">
                   {inviting ? '...' : 'Gerar'}
                 </Button>
               </div>
               <Button size="sm" variant="ghost" className="mt-1 w-full text-xs text-slate-400" onClick={() => setShowInviteInput(false)}>
                 Cancelar
               </Button>
             </div>
           )}
        </div>
      </Card>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 ml-2">Bebê</h3>
        <Card className="border-none shadow-sm">
           <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <Baby className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{baby?.name}</p>
                  <p className="text-xs text-slate-400">
                    Nasc.: {baby && formatDate(baby.birthDate)}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
           </div>
        </Card>
      </section>

      <div className="pt-4">
        <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
};
