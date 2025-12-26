import React from 'react';
import { Card } from '../ui/Card';
import { CommunityFeed } from '../features/CommunityFeed';

export const Community = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="font-bold">Comunidade</h2>
        <CommunityFeed />
      </Card>
    </div>
  );
};
