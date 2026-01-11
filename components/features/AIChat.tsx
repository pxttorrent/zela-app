import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChatMessage } from '../../types';
import { api } from '../../api';

export const AIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', text: 'Olá! Sou a IA do Zela. Tenho acesso a diretrizes da Sociedade Brasileira de Pediatria. Como posso ajudar com seu bebê hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.chat.getContext().then(data => {
        setContext(data.context);
        if (data.context?.babyName) {
            setMessages(prev => [
                { id: 'init', role: 'assistant', text: `Olá! Como posso ajudar com o ${data.context.babyName} hoje?` }
            ]);
        }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Save to backend (fire and forget)
    api.chat.saveLog({ role: 'user', content: input });

    // Simulated RAG response with Context
    setTimeout(() => {
      let responseText = "";
      
      // Simple keyword matching for demo purposes
      if (input.toLowerCase().includes('febre')) {
        responseText = "A febre abaixo de 37.8°C geralmente não requer medicação imediata, mas observe o estado geral do bebê. Mantenha a hidratação.";
      } else if (input.toLowerCase().includes('sono')) {
        responseText = "O sono do bebê nessa fase é polifásico. É normal acordar a cada 3 horas para mamar.";
      } else if (input.toLowerCase().includes('cólica') || input.toLowerCase().includes('colica')) {
        responseText = "Baseado nas diretrizes, para cólicas em recém-nascidos, recomenda-se a técnica do 'charutinho', balanço suave e ruído branco.";
      } else {
        responseText = `Entendi. Como ${context?.babyName || 'o bebê'} está se desenvolvendo muito bem, continue observando os sinais. Se tiver dúvidas médicas específicas, consulte o pediatra.`;
      }

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
      api.chat.saveLog({ role: 'assistant', content: responseText });
    }, 1000);
  };

  return (
    <Card className="h-[400px] flex flex-col overflow-hidden border-indigo-100 shadow-md">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 flex items-center gap-2 text-white">
        <MessageCircle className="w-5 h-5" />
        <h3 className="font-bold text-sm">Zela Assistente</h3>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-500 text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input 
          className="flex-1 bg-slate-100 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Digite sua dúvida..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} size="sm" className="rounded-full w-10 h-10 p-0 bg-indigo-500 hover:bg-indigo-600">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};
