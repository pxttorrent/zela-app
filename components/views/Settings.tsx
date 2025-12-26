import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsPanel } from '../features/SettingsPanel';
import { AdConfig } from '../../types';

interface SettingsProps {
  adConfig: AdConfig;
  setAdConfig: (config: AdConfig) => void;
  // Deprecated
  setView?: (view: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ adConfig, setAdConfig }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <SettingsPanel onClose={() => navigate('/profile')} onChangeAds={(v: boolean) => { setAdConfig({...adConfig, enabled: v}); }} />
    </div>
  );
};
