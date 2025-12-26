import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface SettingsPanelProps {
  onClose: () => void;
  onChangeAds: (v: boolean) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, onChangeAds }) => {
  const [ads, setAds] = useState<boolean>(() => {
    const v = localStorage.getItem('zela_ads');
    return v ? JSON.parse(v) : true;
  });

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Mostrar anúncios</span>
          <input type="checkbox" checked={ads} onChange={() => { const nv = !ads; setAds(nv); onChangeAds(nv); }} />
        </div>
      </Card>
      <Button variant="outline" className="w-full" onClick={onClose}>Voltar</Button>
    </div>
  );
};
