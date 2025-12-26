import React from 'react';
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
  onPartnerInvite: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, baby, setView, onLogout, onPartnerInvite }) => {
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
        <div className="p-4 flex items-center justify-between">
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
           {!user?.partnerName && (
             <Button size="sm" className="h-8 bg-indigo-500 hover:bg-indigo-600 text-xs" onClick={onPartnerInvite}>
               Convidar
             </Button>
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
