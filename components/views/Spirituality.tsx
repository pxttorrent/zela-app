import React from 'react';
import { Card } from '../ui/Card';
import { SpiritualityModule } from '../features/SpiritualityModule';

export const Spirituality = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="font-bold">Devocional</h2>
        <SpiritualityModule />
      </Card>
    </div>
  );
};
