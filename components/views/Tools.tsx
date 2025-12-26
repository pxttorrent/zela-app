import React from 'react';
import { BarChart3, ClipboardList, Users, BookOpen, Settings, Syringe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { SoundMachine } from '../features/SoundMachine';
import { GrowthTracker } from '../features/GrowthTracker';
import { AIChat } from '../features/AIChat';
import { UserData, GrowthLog } from '../../types';

interface ToolsProps {
  user: UserData | null;
  growthLogs: GrowthLog[];
  onAddGrowth: (weight: number, height: number) => void;
  // Deprecated: setView is kept optional for backward compatibility if needed, but navigate is preferred
  setView?: (view: any) => void; 
}

export const Tools: React.FC<ToolsProps> = ({ user, growthLogs, onAddGrowth }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
       <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-500 leading-relaxed">
         O "Canivete Suíço" para facilitar sua rotina diária.
       </div>
       
       <div className="grid grid-cols-2 gap-3">
         <Button variant="white" className="w-full" onClick={() => navigate('/reports')}>
           <BarChart3 className="w-4 h-4 mr-2" />
           Relatórios
         </Button>
         <Button variant="white" className="w-full" onClick={() => navigate('/routine')}>
           <ClipboardList className="w-4 h-4 mr-2" />
           Rotina do Bebê
         </Button>
         <Button variant="white" className="w-full" onClick={() => navigate('/community')}>
           <Users className="w-4 h-4 mr-2" />
           Comunidade
         </Button>
         <Button variant="white" className="w-full" onClick={() => navigate('/spirituality')}>
           <BookOpen className="w-4 h-4 mr-2" />
           Espiritualidade
         </Button>
         {(user?.email === 'admin@zela.com' || user?.is_admin) && (
           <Button variant="white" className="w-full" onClick={() => navigate('/admin')}>
             <Settings className="w-4 h-4 mr-2" />
             Admin
           </Button>
         )}
         <Button variant="white" className="w-full" onClick={() => navigate('/vaccines')}>
           <Syringe className="w-4 h-4 mr-2" />
           Carteirinha
         </Button>
       </div>
       
       {/* Sound Machine (Pain point: Baby doesn't sleep) */}
       <SoundMachine />

       {/* Growth Chart (Pain point: Anxiety) */}
       <GrowthTracker logs={growthLogs} onAdd={onAddGrowth} />

       {/* AI Chat (Pain point: Immediate Help) */}
       <AIChat />
    </div>
  );
};
