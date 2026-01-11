import React from 'react';
import { BabyData } from '../../types';
import { LIFE_STAGE_LABELS } from '../../utils';
import { Baby, Footprints, School, GraduationCap } from 'lucide-react';

interface Props {
  baby: BabyData;
}

const ICONS = {
  baby: Baby,
  toddler: Footprints,
  kid: School,
  teen: GraduationCap
};

export const LifeStageIndicator: React.FC<Props> = ({ baby }) => {
  const stage = baby.lifeStage || 'baby';
  const Icon = ICONS[stage];
  const label = LIFE_STAGE_LABELS[stage];

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
};
