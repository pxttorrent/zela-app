import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { api } from '../../api';

interface SettingsPanelProps {
  onClose: () => void;
  onChangeAds: (v: boolean) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, onChangeAds }) => {
  const [ads, setAds] = useState<boolean>(() => {
    const v = localStorage.getItem('zela_ads');
    return v ? JSON.parse(v) : true;
  });

  const [prefs, setPrefs] = useState<any[]>([]);
  const [loadingPrefs, setLoadingPrefs] = useState(false);

  useEffect(() => {
    setLoadingPrefs(true);
    api.notifications.getPreferences()
      .then(data => setPrefs(data))
      .catch(err => console.error('Failed to load prefs', err))
      .finally(() => setLoadingPrefs(false));
  }, []);

  const handleToggleNotif = async (category: string, enabled: boolean) => {
    // Optimistic update
    setPrefs(prev => prev.map(p => p.category === category ? { ...p, enabled } : p));
    try {
        await api.notifications.updatePreferences({ category, enabled });
    } catch (e) {
        console.error(e);
        // Revert on error
        setPrefs(prev => prev.map(p => p.category === category ? { ...p, enabled: !enabled } : p));
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-bold text-slate-900 mb-4">Geral</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm">Mostrar anúncios</span>
          <input type="checkbox" checked={ads} onChange={() => { const nv = !ads; setAds(nv); onChangeAds(nv); }} />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold text-slate-900 mb-4">Notificações</h3>
        {loadingPrefs ? (
          <p className="text-xs text-slate-400">Carregando...</p>
        ) : (
          <div className="space-y-3">
            {prefs.map(p => (
              <div key={p.category} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{p.label}</p>
                  <p className="text-xs text-slate-400">
                    {p.quietHoursStart && `Silencioso: ${p.quietHoursStart} - ${p.quietHoursEnd}`}
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      name={`toggle-${p.category}`} 
                      id={`toggle-${p.category}`} 
                      checked={p.enabled}
                      onChange={e => handleToggleNotif(p.category, e.target.checked)}
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5"
                    />
                    <label 
                      htmlFor={`toggle-${p.category}`} 
                      className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${p.enabled ? 'bg-indigo-500' : 'bg-slate-300'}`}
                    ></label>
                </div>
              </div>
            ))}
            {prefs.length === 0 && <p className="text-xs text-slate-400">Nenhuma preferência disponível.</p>}
          </div>
        )}
      </Card>

      <Button variant="outline" className="w-full" onClick={onClose}>Voltar</Button>

      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #6366f1;
        }
        .toggle-checkbox {
          right: 0;
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
};
