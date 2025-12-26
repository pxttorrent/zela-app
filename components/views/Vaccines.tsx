import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { VACCINES_DB } from '../../constants';
import { UserVaccine } from '../../types';

interface VaccinesProps {
  userVaccines: UserVaccine[];
  onToggleVaccine: (id: number) => void;
}

export const Vaccines: React.FC<VaccinesProps> = ({ userVaccines, onToggleVaccine }) => {
  return (
    <div className="space-y-6">
      {[0, 60, 90, 120, 270, 365].map(days => {
         const vaccinesInGroup = userVaccines
           .map(v => ({ ...v, ...VACCINES_DB.find(t => t.id === v.templateId)! }))
           .filter(v => v.daysFromBirth === days);
         
         if (vaccinesInGroup.length === 0) return null;

         let label = days === 0 ? "Ao Nascer" : `${Math.floor(days/30)} Meses`;
         if (days === 365) label = "1 Ano";

         return (
           <div key={days}>
             <div className="flex items-center gap-4 mb-3">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                <div className="h-px bg-slate-200 flex-1"></div>
             </div>
             <div className="space-y-3">
               {vaccinesInGroup.map(v => (
                 <div 
                   key={v.templateId}
                   onClick={() => onToggleVaccine(v.templateId)}
                   className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                     v.status === 'done' 
                       ? 'bg-emerald-50/50 border-emerald-100' 
                       : 'bg-white border-slate-100 hover:border-slate-200'
                   }`}
                 >
                   <div className="mt-1">
                     {v.status === 'done' ? (
                       <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                     ) : (
                       <Circle className="w-6 h-6 text-slate-300" />
                     )}
                   </div>
                   <div>
                     <h4 className={`font-semibold ${v.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                       {v.name}
                     </h4>
                     <p className="text-xs text-slate-500 mt-1">{v.description}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )
      })}
    </div>
  );
};
