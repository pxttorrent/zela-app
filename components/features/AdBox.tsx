import React, { useEffect } from 'react';
import { Card } from '../ui/Card';
import { AdConfig } from '../../types';

interface AdBoxProps {
  config?: AdConfig;
}

export const AdBox: React.FC<AdBoxProps> = ({ config }) => {
  if (!config || !config.enabled) return null;

  useEffect(() => {
    try {
      if (window && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense Error", e);
    }
  }, []);

  return (
    <Card className="p-4 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 min-h-[100px]">
      <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Publicidade</div>
      {/* Google AdSense Responsive Unit */}
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%' }}
           data-ad-client={config.clientId}
           data-ad-slot={config.slots.dashboard}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </Card>
  );
};
