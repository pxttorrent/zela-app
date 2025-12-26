import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChatMessage } from '../../types';

export const CommunityFeed = () => {
  const [posts, setPosts] = useState<ChatMessage[]>([
    { id: 'p1', role: 'user', text: 'Consegui melhorar o sono do meu bebê em 2 semanas!' }
  ]);
  const [text, setText] = useState('');

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {posts.map(p => (
          <Card key={p.id} className="p-4">
            <div className="text-sm">{p.text}</div>
          </Card>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Compartilhe uma vitória" />
        <Button onClick={() => { if (text) { setPosts([{ id: Date.now().toString(), role: 'user', text }, ...posts]); setText(''); }}}>Publicar</Button>
      </div>
    </div>
  );
};
