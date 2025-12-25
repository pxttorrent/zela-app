
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Heart, Trophy, ShieldCheck, Home, Syringe, User, 
  CheckCircle2, Circle, Clock, Star, Flame, 
  ChevronRight, Baby, Settings, LogOut, Check,
  Milk, Moon, Bath, MessageCircle, Play, Pause,
  LineChart, Plus, Users, Music, Activity, BookOpen, BarChart3, ClipboardList, LogIn,
  TrendingUp, Search, MoreHorizontal, Trash2, Megaphone, Bell
 } from 'lucide-react';

import { api } from './api';
import { SalesLanding } from './components/SalesLanding';

// --- TYPES ---
type View = 'landing' | 'onboarding' | 'dashboard' | 'tools' | 'vaccines' | 'profile' | 'login' | 'signup' | 'reports' | 'routine' | 'community' | 'spirituality' | 'admin' | 'landingSales' | 'settings';

type ChallengeCategory = 'motor' | 'cognitivo' | 'nutricao' | 'sono' | 'afeto' | 'saude_mae';

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: ChallengeCategory;
  minAgeWeeks: number;
  maxAgeWeeks: number;
  durationMinutes: number;
  xpReward: number;
}

interface VaccineTemplate {
  id: number;
  name: string;
  description: string;
  daysFromBirth: number;
}

interface UserData {
  id?: number | string;
  name: string;
  email: string;
  isOnboarded: boolean;
  points: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  partnerName?: string; // For Duo Mode
}

interface BabyData {
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'boy' | 'girl' | null;
}

interface UserChallenge {
  challengeId: number;
  completedDate: string;
}

interface UserVaccine {
  templateId: number;
  takenAt: string | null;
  status: 'pending' | 'done' | 'delayed';
}

// New Types for "Easy Code" Features
type TrackerType = 'feed_left' | 'feed_right' | 'bottle' | 'diaper' | 'sleep' | 'bath';

interface TrackerLog {
  id: string;
  type: TrackerType;
  timestamp: number; // Date.now()
}

interface GrowthLog {
  date: string;
  weight: number; // kg
  height: number; // cm
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface AdConfig {
  enabled: boolean;
  clientId: string; // ca-pub-XXXXXXXXXXXXXXXX
  slots: {
    dashboard: string; // Slot ID for dashboard banner
  };
}

interface PushNotification {
  id: number;
  title: string;
  body: string;
  sentAt: string;
  audience: string;
}

// --- SEED DATA ---
const VACCINES_DB: VaccineTemplate[] = [
  { id: 1, name: 'BCG', daysFromBirth: 0, description: 'Formas graves de tuberculose.' },
  { id: 2, name: 'Hepatite B', daysFromBirth: 0, description: 'Ao nascer.' },
  { id: 3, name: 'Penta (1ª dose)', daysFromBirth: 60, description: 'Difteria, Tétano, Coqueluche...' },
  { id: 4, name: 'VIP (1ª dose)', daysFromBirth: 60, description: 'Poliomielite inativada.' },
  { id: 5, name: 'Pneumocócica 10 (1ª)', daysFromBirth: 60, description: 'Pneumonia, otite, meningite.' },
  { id: 6, name: 'Rotavírus (1ª dose)', daysFromBirth: 60, description: 'Diarreia por rotavírus.' },
  { id: 7, name: 'Meningocócica C (1ª)', daysFromBirth: 90, description: 'Meningite C.' },
  { id: 8, name: 'Penta (2ª dose)', daysFromBirth: 120, description: 'Reforço imunológico.' },
  { id: 9, name: 'VIP (2ª dose)', daysFromBirth: 120, description: 'Reforço poliomielite.' },
  { id: 10, name: 'Febre Amarela', daysFromBirth: 270, description: 'Aos 9 meses.' },
  { id: 11, name: 'Tríplice Viral', daysFromBirth: 365, description: 'Sarampo, Caxumba, Rubéola.' },
];

const CHALLENGES_DB: Challenge[] = [
  { id: 1, title: 'Olho no olho', description: 'Segure o bebê a 30cm do rosto e converse sorrindo.', category: 'afeto', minAgeWeeks: 0, maxAgeWeeks: 12, durationMinutes: 5, xpReward: 10 },
  { id: 2, title: 'Massagem suave', description: 'Faça movimentos suaves nas perninhas após o banho.', category: 'motor', minAgeWeeks: 0, maxAgeWeeks: 24, durationMinutes: 5, xpReward: 15 },
  { id: 3, title: 'Barriguinha para baixo', description: 'Coloque o bebê de bruços no seu peito por 2 min (Tummy Time).', category: 'motor', minAgeWeeks: 0, maxAgeWeeks: 12, durationMinutes: 2, xpReward: 20 },
  { id: 4, title: 'Sons suaves', description: 'Use um chocalho suave de um lado para o outro para ele acompanhar.', category: 'cognitivo', minAgeWeeks: 2, maxAgeWeeks: 12, durationMinutes: 3, xpReward: 10 },
  { id: 5, title: 'Pele a pele', description: 'Fique 5 minutos com o bebê apenas de fralda no seu colo.', category: 'afeto', minAgeWeeks: 0, maxAgeWeeks: 12, durationMinutes: 5, xpReward: 15 },
  { id: 6, title: 'Cuidado materno', description: 'Tire 5 minutos para beber um copo d\'água e respirar fundo.', category: 'saude_mae', minAgeWeeks: 0, maxAgeWeeks: 100, durationMinutes: 5, xpReward: 50 },
  { id: 7, title: 'Seguindo a luz', description: 'Use uma lanterna fraca em ambiente penumbra para ele seguir com o olhar.', category: 'cognitivo', minAgeWeeks: 4, maxAgeWeeks: 16, durationMinutes: 3, xpReward: 15 },
  { id: 8, title: 'Bicicletinha', description: 'Movimente as pernas do bebê como se pedalasse para aliviar gases.', category: 'motor', minAgeWeeks: 2, maxAgeWeeks: 24, durationMinutes: 5, xpReward: 10 },
  { id: 9, title: 'Conversa', description: 'Imite os sons que o bebê faz (Gugu-Dada) respondendo a ele.', category: 'cognitivo', minAgeWeeks: 8, maxAgeWeeks: 30, durationMinutes: 5, xpReward: 10 },
  { id: 10, title: 'Texturas', description: 'Passe tecidos diferentes (algodão, seda) na mãozinha dele.', category: 'motor', minAgeWeeks: 8, maxAgeWeeks: 20, durationMinutes: 3, xpReward: 15 },
];

const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  motor: 'Motor',
  cognitivo: 'Cognitivo',
  nutricao: 'Nutrição',
  sono: 'Sono',
  afeto: 'Afeto',
  saude_mae: 'Mamãe',
};

// --- UTILS ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const month = monthNames[date.getMonth()];
  return `${day} de ${month}`;
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const addDays = (dateStr: string, days: number) => {
  const result = new Date(dateStr);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
};

const differenceInWeeks = (d1: string, d2: string) => {
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  return Math.floor((t1 - t2) / (7 * 24 * 60 * 60 * 1000));
};

const differenceInDays = (d1: string, d2: string) => {
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  return Math.floor((t1 - t2) / (24 * 60 * 60 * 1000));
};

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-rose-300";
  const variants = {
    primary: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200 hover:from-rose-600 hover:to-rose-700",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900",
    white: "bg-white text-slate-900 shadow-sm border border-slate-100 hover:bg-slate-50"
  };
  const size = props.size === 'sm' ? 'h-9 px-3 text-xs' : props.size === 'lg' ? 'h-14 px-8 text-base' : 'h-12 px-4';
  
  return (
    <button className={`${base} ${variants[variant as keyof typeof variants]} ${size} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md ${className}`}>{children}</div>
);

const Badge = ({ children, variant = 'default', className = '' }: any) => {
  const variants = {
    default: "bg-rose-100 text-rose-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    neutral: "bg-slate-100 text-slate-600"
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </span>
  );
};

// --- FEATURES UI ---

// 1. Tracker Button
const TrackerButton = ({ icon: Icon, label, onClick, lastTime }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all h-24 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-1 text-rose-500">
      <Icon className="w-5 h-5" />
    </div>
    <span className="relative z-10 text-xs font-semibold text-slate-700">{label}</span>
    {lastTime && (
      <span className="relative z-10 text-[10px] text-slate-400 mt-1">{formatTime(lastTime)}</span>
    )}
  </button>
);

// 2. White Noise Player (Simulated)
const SoundMachine = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const sounds = [
    { id: 'white', name: 'Ruído Branco' },
    { id: 'rain', name: 'Chuva' },
    { id: 'womb', name: 'Útero' },
    { id: 'hair', name: 'Secador' },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-indigo-500" />
        <h3 className="font-bold text-slate-900">Para Dormir (Ruído Branco)</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sounds.map(sound => (
          <button
            key={sound.id}
            onClick={() => setPlaying(playing === sound.id ? null : sound.id)}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              playing === sound.id 
                ? 'bg-indigo-500 text-white border-indigo-500' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-xs font-medium">{sound.name}</span>
            {playing === sound.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
        ))}
      </div>
      {playing && (
        <div className="mt-3 text-[10px] text-center text-slate-400 animate-pulse">
          Reproduzindo áudio em loop... (Simulado)
        </div>
      )}
    </Card>
  );
};

// 3. Growth Chart (Simulated SVG)
const GrowthTracker = ({ logs, onAdd }: { logs: GrowthLog[], onAdd: (w: number, h: number) => void }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  const lastLog = logs[logs.length - 1];

  // Simple SVG chart logic
  const width = 300;
  const heightPx = 100;
  const points = logs.map((log, i) => {
    const x = (i / (logs.length || 1)) * width;
    // Normalize weight roughly between 2kg and 10kg for scale
    const y = heightPx - ((log.weight - 2) / 8) * heightPx; 
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-emerald-500" />
        <h3 className="font-bold text-slate-900">Curva de Crescimento</h3>
      </div>

      {logs.length > 1 && (
        <div className="mb-6 border-b border-slate-100 pb-4">
           <svg width="100%" height={heightPx} className="overflow-visible">
             <polyline 
               points={points} 
               fill="none" 
               stroke="#10b981" 
               strokeWidth="3" 
               strokeLinecap="round"
             />
             {logs.map((_, i) => (
                <circle key={i} cx={(i / logs.length) * width} cy={heightPx - ((logs[i].weight - 2) / 8) * heightPx} r="4" fill="white" stroke="#10b981" strokeWidth="2" />
             ))}
           </svg>
           <div className="flex justify-between text-[10px] text-slate-400 mt-2">
             <span>Nascer</span>
             <span>Hoje</span>
           </div>
        </div>
      )}

      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400">Peso (kg)</label>
          <input 
            type="number" 
            value={weight} 
            onChange={e => setWeight(e.target.value)}
            placeholder={lastLog ? String(lastLog.weight) : "0.0"}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400">Altura (cm)</label>
          <input 
             type="number"
             value={height}
             onChange={e => setHeight(e.target.value)}
             placeholder={lastLog ? String(lastLog.height) : "0.0"}
             className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <Button 
          onClick={() => {
            if (weight && height) {
              onAdd(Number(weight), Number(height));
              setWeight('');
              setHeight('');
            }
          }}
          className="h-10 w-10 p-0 rounded-lg bg-slate-900 hover:bg-slate-800"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

// 4. AI Chat (Simulated)
const AIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', text: 'Olá! Sou a IA do Zela. Tenho acesso a diretrizes da Sociedade Brasileira de Pediatria. Como posso ajudar com seu bebê hoje?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated RAG response
    setTimeout(() => {
      const responses = [
        "Baseado nas diretrizes, para cólicas em recém-nascidos, recomenda-se a técnica do 'charutinho', balanço suave e ruído branco. Evite chás antes dos 6 meses.",
        "A febre abaixo de 37.8°C geralmente não requer medicação imediata, mas observe o estado geral do bebê. Mantenha a hidratação.",
        "O sono do bebê nessa fase é polifásico. É normal acordar a cada 3 horas para mamar."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: randomResponse }]);
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


// 2. Main App Logic
export default function App() {
  // --- STATE ---
  const [view, setView] = useState<View>('landingSales');
  const [loading, setLoading] = useState(true);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  
  // Data State
  const [user, setUser] = useState<UserData | null>(null);
  const [baby, setBaby] = useState<BabyData | null>(null);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [userVaccines, setUserVaccines] = useState<UserVaccine[]>([]);
  
  // New "Swiss Army Knife" State
  const [trackers, setTrackers] = useState<TrackerLog[]>([]);
  const [growthLogs, setGrowthLogs] = useState<GrowthLog[]>([]);
  const [adConfig, setAdConfig] = useState<AdConfig>({ enabled: false, clientId: '', slots: { dashboard: '' } });
  const [xpByCategory, setXpByCategory] = useState<Record<ChallengeCategory, number>>({
    afeto: 15, motor: 15, cognitivo: 15, nutricao: 15, sono: 15, saude_mae: 50
  });


  const LEVELS = useMemo(() => [
    { name: 'Broto', threshold: 0 },
    { name: 'Ninho', threshold: 50 },
    { name: 'Aurora', threshold: 150 },
    { name: 'Abraço', threshold: 300 },
    { name: 'Estrela', threshold: 600 },
    { name: 'Brilho', threshold: 1000 },
    { name: 'Zela Mestre', threshold: 1500 },
  ], []);
  const [celebration, setCelebration] = useState<{ show: boolean; gained: number; levelUp?: string }>({ show: false, gained: 0 });

  // --- PERSISTENCE ---
  useEffect(() => {
    const token = localStorage.getItem('zela_token');
    
    if (token) {
      setLoading(true);
      api.getMe(token).then(async ({ user }) => {
        setUser(user);
        
        // Admin Bypass
        if (user.email === 'admin@zela.com') {
          setView('admin');
          setLoading(false);
          return;
        }

        try {
          // Load Dashboard Data (Baby, Trackers, Challenges, Config)
          const data = await api.getDashboard();
          
          if (data.adConfig) {
            setAdConfig(data.adConfig);
          }
          
          if (data.baby) {
            setBaby({
              name: data.baby.name,
              birthDate: data.baby.birth_date, // Map snake_case
              gender: data.baby.gender
            });
            // Map baby.id for internal use if needed, but we mostly need it for API calls
            // We might need to store full baby object or ID in state
            // Let's add id to baby state or store separate
            // For now, let's assume we can fetch babyId from backend response and store it.
            // Extending baby type on the fly or proper type
            (data.baby as any).id = data.baby.id; 
            
            setHasSavedSession(true);
            setView('dashboard');
          } else {
             setView('onboarding');
          }

          if (data.trackers) {
             setTrackers(data.trackers.map((t: any) => ({
               id: t.id,
               type: t.type,
               timestamp: new Date(t.timestamp).getTime()
             })));
          }

          if (data.recentChallenges) {
             setUserChallenges(data.recentChallenges.map((c: any) => ({
                challengeId: c.template_id,
                completedDate: c.completed_at
             })));
          }

        } catch (err) {
          console.error('Error loading dashboard', err);
        }

      }).catch(() => {
        localStorage.removeItem('zela_token');
        setView('landingSales');
      }).finally(() => setLoading(false));
    } else {
      setView('landingSales');
      setLoading(false);
    }
  }, []);

  // --- ACTIONS ---
  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const { user, token } = await api.login(formData.get('email') as string, formData.get('password') as string);
      localStorage.setItem('zela_token', token);
      setUser(user);
      
      // Admin Bypass
      if (user.email === 'admin@zela.com') {
        setView('admin');
        return;
      }

      // Load Dashboard
      const data = await api.getDashboard();
      if (data.baby) {
         setBaby({ name: data.baby.name, birthDate: data.baby.birth_date, gender: data.baby.gender });
         setView('dashboard');
      } else {
         setView('onboarding');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAuthSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const { user, token } = await api.signup(formData.get('name') as string, formData.get('email') as string, formData.get('password') as string);
      localStorage.setItem('zela_token', token);
      setUser(user);
      setView('onboarding');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateBaby = async (name: string, birthDate: string, gender: any) => {
    try {
      const newBaby = await api.saveBaby(name, birthDate, gender);
      setBaby({ name: newBaby.name, birthDate: newBaby.birth_date, gender: newBaby.gender });
      window.location.reload(); 
    } catch (err) {
      alert('Failed to save baby');
    }
  };

  const handleCompleteChallenge = async (challengeId: number, xp: number) => {
    if (!user) return;
    
    // Optimistic Update
    const newEntry = { challengeId, completedDate: getTodayString() };
    setUserChallenges([...userChallenges, newEntry]);
    setUser({ ...user, points: user.points + xp });
    setCelebration({ show: true, gained: xp });

    // API Call
    // Note: We need babyId. If dashboard loaded correctly, we have it in state or we need to add it.
    // For now, let's assume babyId is available on the baby object (we hacked it in useEffect)
    // or we fetch it.
    if ((baby as any)?.id) {
       api.completeChallenge(challengeId, xp, (baby as any).id).catch(console.error);
    }
  };

  const handleToggleVaccine = (templateId: number) => {
    // Vaccines API not implemented yet, keeping local state logic for UI only
    const updatedVaccines = userVaccines.map(v => {
      if (v.templateId === templateId) {
        return {
          ...v,
          status: v.status === 'done' ? 'pending' : 'done',
          takenAt: v.status === 'done' ? null : getTodayString()
        } as UserVaccine;
      }
      return v;
    });
    setUserVaccines(updatedVaccines);
  };
  
  const handleTracker = async (type: TrackerType) => {
    // Optimistic
    const newLog: TrackerLog = { id: Date.now().toString(), type, timestamp: Date.now() };
    const updated = [newLog, ...trackers].slice(0, 50);
    setTrackers(updated);
    
    // API
    if ((baby as any)?.id) {
       await api.addTracker(type, Date.now(), (baby as any).id);
    }
  };

  const handleAddGrowth = (weight: number, height: number) => {
    // Growth API not implemented yet
    const newLog: GrowthLog = { date: getTodayString(), weight, height };
    const updated = [...growthLogs, newLog].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setGrowthLogs(updated);
  };

  const handlePartnerInvite = () => {
    if(!user) return;
    const updatedUser = { ...user, partnerName: "Papai" }; 
    setUser(updatedUser);
    alert("Convite enviado! O Papai agora tem acesso aos dados.");
  };

  const handleLogout = () => {
    localStorage.removeItem('zela_token');
    // Keep onboarding data locally? No, clear all session data
    setUser(null);
    setBaby(null);
    setUserChallenges([]);
    setUserVaccines([]);
    setTrackers([]);
    setGrowthLogs([]);
    setHasSavedSession(false);
    setView('landingSales');
  };

  // --- DERIVED DATA ---
  const babyAgeWeeks = baby ? differenceInWeeks(getTodayString(), baby.birthDate) : 0;
  
  const generateWeeklyChallenges = (week: number): Challenge[] => {
    const items: Array<{ title: string; description: string; category: ChallengeCategory; durationMinutes: number }> = [
      { title: 'Olho no olho', description: 'Contato visual e sorriso', category: 'afeto', durationMinutes: 5 },
      { title: 'Tummy Time', description: 'Barriguinha para baixo', category: 'motor', durationMinutes: 2 },
      { title: 'Sons suaves', description: 'Acompanhar chocalho suave', category: 'cognitivo', durationMinutes: 3 },
      { title: 'Toque de carinho', description: 'Massagem suave nas perninhas', category: 'motor', durationMinutes: 5 },
      { title: 'Pele a pele', description: 'Contato próximo', category: 'afeto', durationMinutes: 5 },
      { title: 'Cuidado materno', description: 'Hidratar-se e respirar fundo', category: 'saude_mae', durationMinutes: 5 },
    ];
    return items.map((base, idx) => ({
      id: week * 10 + idx,
      title: base.title,
      description: base.description,
      category: base.category,
      minAgeWeeks: week,
      maxAgeWeeks: week,
      durationMinutes: base.durationMinutes,
      xpReward: xpByCategory[base.category]
    }));
  };
  const dailyChallenges = useMemo(() => {
    if (!baby) return [];
    const templates = generateWeeklyChallenges(babyAgeWeeks);
    const today = getTodayString();
    const completedTodayIds = userChallenges
      .filter(uc => uc.completedDate === today)
      .map(uc => uc.challengeId);
    const daySeed = new Date().getDate(); 
    const startIndex = daySeed % Math.max(1, templates.length - 2);
    return templates.slice(startIndex, startIndex + 3).map(c => ({
      ...c,
      isCompleted: completedTodayIds.includes(c.id)
    }));
  }, [baby, babyAgeWeeks, userChallenges, xpByCategory]);

  const nextVaccine = useMemo(() => {
    if (!baby || !userVaccines.length) return null;
    const pending = userVaccines
      .filter(v => v.status !== 'done')
      .map(v => {
        const t = VACCINES_DB.find(temp => temp.id === v.templateId);
        if (!t) return null;
        const dueDate = addDays(baby.birthDate, t.daysFromBirth);
        return { ...v, ...t, dueDate };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a!.dueDate).getTime() - new Date(b!.dueDate).getTime());
    return pending[0] || null;
  }, [baby, userVaccines]);

  // Helper to get last tracker time
  const getLastTrackerTime = (type: TrackerType) => {
    const log = trackers.find(t => t.type === type);
    return log ? log.timestamp : null;
  };


  // --- VIEWS ---

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-rose-500">Carregando...</div>;

  // LANDING VIEW
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 text-center space-y-6 z-10">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            ZELA
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            O "Canivete Suíço" para pais de primeira viagem.
          </p>
          
          <div className="grid grid-cols-2 gap-3 w-full mt-8">
             <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700">Desafios</span>
             </div>
             <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700">Vacinas</span>
             </div>
             <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <Music className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700">Ruído Branco</span>
             </div>
             <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <MessageCircle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700">IA Pediatra</span>
             </div>
          </div>
          <div className="w-full mt-6">
            <Button className="w-full h-12" onClick={() => setView('login')}>Entrar</Button>
          </div>
          <div className="w-full">
            <Button variant="outline" className="w-full h-12 mt-2" onClick={() => setView('landingSales')}>Conheça o Zela</Button>
          </div>
        </div>
        
        <div className="p-8 pb-12 mt-auto bg-white border-t border-slate-50">
          <Button onClick={() => setView('signup')} size="lg" className="w-full text-lg shadow-xl shadow-rose-200 bg-gradient-to-r from-rose-500 to-rose-600">
            Começar Agora
          </Button>
          <p className="text-center text-xs text-slate-400 mt-4">
            Simulação de PWA • Versão Completa
          </p>
        </div>
      </div>
    );
  }

  // ONBOARDING VIEW
  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Bem-vindo ao Zela</h1>
            <p className="text-slate-500 mt-2 text-sm">Vamos configurar o perfil do seu bebê.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleCreateBaby(
              formData.get('name') as string,
              formData.get('birthDate') as string,
              formData.get('gender')
            );
          }} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nome do bebê</label>
              <input name="name" required className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Ex: Gabriel" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Data de Nascimento</label>
              <input name="birthDate" type="date" required className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Gênero</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="gender" value="boy" className="peer sr-only" />
                  <div className="rounded-xl border-2 border-slate-100 peer-checked:border-rose-500 peer-checked:bg-rose-50 p-4 text-center text-sm font-medium hover:bg-slate-50 transition-all">
                    Menino
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="gender" value="girl" className="peer sr-only" />
                  <div className="rounded-xl border-2 border-slate-100 peer-checked:border-rose-500 peer-checked:bg-rose-50 p-4 text-center text-sm font-medium hover:bg-slate-50 transition-all">
                    Menina
                  </div>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg">
              Continuar
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'landingSales') {
    return (
      <div className="min-h-screen bg-white flex flex-col w-full relative">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Zela" className="w-12 h-12 rounded-[12px] shadow-sm" />
            <div className="font-extrabold tracking-tight text-slate-900 text-xl">ZELA</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setView('login')}>
            Entrar
          </Button>
        </div>
        <main className="flex-1 w-full">
          <SalesLanding
            canContinue={hasSavedSession}
            onContinue={() => setView('dashboard')}
            onStartFree={() => setView('signup')}
            onSubscribe={() => setView('signup')}
          />
        </main>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="p-6 space-y-4">
            <div className="text-center">
              <LogIn className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <h2 className="font-bold">Entrar no Zela</h2>
            </div>
            <form className="space-y-3" onSubmit={handleAuthLogin}>
              <input name="email" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Email" type="email" required />
              <input name="password" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Senha" type="password" required />
              <Button className="w-full h-12">Entrar</Button>
            </form>
            <Button variant="outline" className="w-full h-12" onClick={() => setView('landingSales')}>
              Voltar
            </Button>
            <div className="text-center text-xs mt-2">
               Não tem conta? <span className="text-rose-500 font-bold cursor-pointer" onClick={() => setView('signup')}>Cadastre-se</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'signup') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="p-6 space-y-4">
            <div className="text-center">
              <Heart className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <h2 className="font-bold">Criar Conta</h2>
              <p className="text-xs text-slate-500 mt-1">Comece sua jornada no Zela</p>
            </div>
            <form className="space-y-3" onSubmit={handleAuthSignup}>
              <input name="name" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Seu Nome" type="text" required />
              <input name="email" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Email" type="email" required />
              <input name="password" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Senha" type="password" required />
              <Button className="w-full h-12">Criar Conta</Button>
            </form>
            <Button variant="outline" className="w-full h-12" onClick={() => setView('landingSales')}>
              Voltar
            </Button>
            <div className="text-center text-xs mt-2">
               Já tem conta? <span className="text-rose-500 font-bold cursor-pointer" onClick={() => setView('login')}>Entrar</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col w-full relative">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-slate-900">Zela Admin</div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        <main className="flex-1 p-6 pb-24">
          <AdminPanel 
            user={user} 
            onLogout={handleLogout}
          />
        </main>
      </div>
    );
  }

  // MAIN SHELL
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col pb-24">
        
        {/* HEADER */}
        <header className="px-6 py-6 bg-white sticky top-0 z-20 border-b border-slate-50 flex justify-between items-center">
           <div>
             <h1 className="text-2xl font-bold text-slate-900">
               {view === 'dashboard' ? `Olá, ${user?.name?.split(' ')[0] ?? 'Zela'}` : 
                view === 'vaccines' ? 'Carteirinha' : 
                view === 'tools' ? 'Ferramentas' : 
                view === 'profile' ? 'Perfil' :
                view === 'login' ? 'Entrar' :
                view === 'reports' ? 'Relatórios' :
                view === 'routine' ? 'Rotina' :
                view === 'community' ? 'Comunidade' :
                view === 'spirituality' ? 'Espiritualidade' :
                view === 'admin' ? 'Admin' :
                view === 'landingSales' ? 'Conheça o Zela' :
                view === 'settings' ? 'Configurações' : ''}
             </h1>
             <p className="text-sm text-slate-500 flex items-center gap-1">
               {baby?.name} • {babyAgeWeeks} semanas
             </p>
           </div>
           {view === 'profile' ? (
             <button
               type="button"
               onClick={() => setView('settings')}
               className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 active:scale-95 transition-all"
             >
               <Settings className="text-slate-400 w-6 h-6" />
             </button>
           ) : (
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
               <User className="w-5 h-5 text-slate-400" />
             </div>
           )}
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-8">
          
          {view === 'dashboard' && (
            <>
              {/* QUICK TRACKERS (Pain point: Memory Loss) */}
              <div className="grid grid-cols-4 gap-3">
                 <TrackerButton 
                    icon={Milk} 
                    label="Esq" 
                    onClick={() => handleTracker('feed_left')} 
                    lastTime={getLastTrackerTime('feed_left')} 
                 />
                 <TrackerButton 
                    icon={Milk} 
                    label="Dir" 
                    onClick={() => handleTracker('feed_right')} 
                    lastTime={getLastTrackerTime('feed_right')} 
                 />
                 <TrackerButton 
                    icon={Moon} 
                    label="Fralda" 
                    onClick={() => handleTracker('diaper')} 
                    lastTime={getLastTrackerTime('diaper')} 
                 />
                 <TrackerButton 
                    icon={Moon} 
                    label="Sono" 
                    onClick={() => handleTracker('sleep')} 
                    lastTime={getLastTrackerTime('sleep')} 
                 />
              </div>

              {/* STATUS CARDS */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex flex-col items-center justify-center py-6">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-2xl">
                    <Star className="fill-current w-6 h-6" />
                    {user?.points}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Pontos</span>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center py-6">
                  <div className="flex items-center gap-2 text-rose-500 font-bold text-2xl">
                    <Flame className="fill-current w-6 h-6" />
                    {user?.streak}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Dias Seguidos</span>
                </Card>
              </div>
              
              {adConfig.enabled && (
                <AdBox config={adConfig} />
              )}

              {/* CHALLENGES */}
              <section>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Missões de Hoje</h2>
                  <Badge variant="neutral">{dailyChallenges.filter(c => c.isCompleted).length}/{dailyChallenges.length}</Badge>
                </div>
                <div className="space-y-4">
                  {dailyChallenges.map(challenge => (
                    <Card key={challenge.id} className={`overflow-hidden transition-all border-l-4 ${challenge.isCompleted ? 'border-l-emerald-500 bg-slate-50 opacity-80' : 'border-l-rose-500'}`}>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="uppercase text-[10px] tracking-wider mb-2">
                            {CATEGORY_LABELS[challenge.category]}
                          </Badge>
                          <div className="flex items-center text-slate-400 text-xs gap-1">
                            <Clock className="w-3 h-3" /> {challenge.durationMinutes} min
                          </div>
                        </div>
                        <h3 className={`font-bold text-lg mb-1 ${challenge.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                          {challenge.description}
                        </p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> +{challenge.xpReward} XP
                          </span>
                          <Button 
                            size="sm"
                            disabled={challenge.isCompleted}
                            onClick={() => handleCompleteChallenge(challenge.id, challenge.xpReward)}
                            className={challenge.isCompleted ? "bg-emerald-500 hover:bg-emerald-600 text-white w-24" : "w-24"}
                          >
                            {challenge.isCompleted ? <Check className="w-4 h-4" /> : "Concluir"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* NEXT VACCINE */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Próxima Vacina</h2>
                <Card className="p-5 border-l-4 border-l-indigo-500">
                  {nextVaccine ? (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900">{nextVaccine.name}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          differenceInDays(getTodayString(), nextVaccine.dueDate) > 0 
                            ? "bg-red-100 text-red-600" 
                            : "bg-indigo-50 text-indigo-600"
                        }`}>
                          {formatDate(nextVaccine.dueDate)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">{nextVaccine.description}</p>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setView('vaccines')}>
                        Ver Carteirinha
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-slate-500 text-sm">Todas as vacinas em dia! 🎉</div>
                  )}
                </Card>
              </section>
            </>
          )}

          {view === 'tools' && (
           <div className="space-y-6">
               <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-500 leading-relaxed">
                 O "Canivete Suíço" para facilitar sua rotina diária.
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 <Button variant="white" className="w-full" onClick={() => setView('reports')}>
                   <BarChart3 className="w-4 h-4 mr-2" />
                   Relatórios
                 </Button>
                 <Button variant="white" className="w-full" onClick={() => setView('routine')}>
                   <ClipboardList className="w-4 h-4 mr-2" />
                   Rotina do Bebê
                 </Button>
                 <Button variant="white" className="w-full" onClick={() => setView('community')}>
                   <Users className="w-4 h-4 mr-2" />
                   Comunidade
                 </Button>
                 <Button variant="white" className="w-full" onClick={() => setView('spirituality')}>
                   <BookOpen className="w-4 h-4 mr-2" />
                   Espiritualidade
                 </Button>
                 {user?.email === 'admin@zela.com' && (
                   <Button variant="white" className="w-full" onClick={() => setView('admin')}>
                     <Settings className="w-4 h-4 mr-2" />
                     Admin
                   </Button>
                 )}
                 <Button variant="white" className="w-full" onClick={() => setView('vaccines')}>
                   <Syringe className="w-4 h-4 mr-2" />
                   Carteirinha
                 </Button>
               </div>
               
               {/* Sound Machine (Pain point: Baby doesn't sleep) */}
               <SoundMachine />

               {/* Growth Chart (Pain point: Anxiety) */}
               <GrowthTracker logs={growthLogs} onAdd={handleAddGrowth} />

               {/* AI Chat (Pain point: Immediate Help) */}
               <AIChat />
            </div>
          )}

          {view === 'reports' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="font-bold mb-4">Cuidado do Bebê</h2>
                <SimpleCharts trackers={trackers} growthLogs={growthLogs} />
              </Card>
            </div>
          )}

          {view === 'routine' && (
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <h2 className="font-bold">Questionário</h2>
                <RoutineQuestionnaire onDone={() => setView('dashboard')} />
              </Card>
            </div>
          )}

          {view === 'community' && (
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <h2 className="font-bold">Comunidade</h2>
                <CommunityFeed />
              </Card>
            </div>
          )}

          {view === 'spirituality' && (
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <h2 className="font-bold">Devocional</h2>
                <SpiritualityModule />
              </Card>
            </div>
          )}




          {view === 'settings' && (
            <div className="space-y-6">
              <SettingsPanel onClose={() => setView('profile')} onChangeAds={(v: boolean) => { setAdConfig({...adConfig, enabled: v}); }} />
            </div>
          )}

          {view === 'vaccines' && (
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
                           onClick={() => handleToggleVaccine(v.templateId)}
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
          )}

          {view === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-2xl font-bold text-rose-500">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>

              {/* Duo Mode (Pain point: Couple Sync) */}
              <Card className="bg-indigo-50 border-indigo-100">
                <div className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-500">
                       <Users className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-bold text-indigo-900">Modo Dupla</h3>
                       <p className="text-xs text-indigo-600">
                         {user?.partnerName 
                           ? `Sincronizado com ${user.partnerName}` 
                           : "Convide seu parceiro(a)"}
                       </p>
                     </div>
                   </div>
                   {!user?.partnerName && (
                     <Button size="sm" className="h-8 bg-indigo-500 hover:bg-indigo-600 text-xs" onClick={handlePartnerInvite}>
                       Convidar
                     </Button>
                   )}
                </div>
              </Card>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 ml-2">Bebê</h3>
                <Card className="border-none shadow-sm">
                   <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                          <Baby className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{baby?.name}</p>
                          <p className="text-xs text-slate-400">
                            Nasc.: {baby && formatDate(baby.birthDate)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                   </div>
                </Card>
              </section>

              <div className="pt-4">
                <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
              </div>
            </div>
          )}
        </main>
        
        {celebration.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <Card className="p-6 w-80 text-center animate-[fadeIn_300ms_ease]">
              <div className="flex items-center justify-center mb-3">
                <Star className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse" />
              </div>
              <div className="text-lg font-bold">+{celebration.gained} XP</div>
              {celebration.levelUp && <div className="mt-2 text-rose-600 font-semibold">Nível {celebration.levelUp}</div>}
              <Button className="mt-4 w-full" onClick={() => setCelebration({ show: false, gained: 0 })}>Continuar</Button>
            </Card>
          </div>
        )}

        {/* BOTTOM NAV */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-slate-200 pointer-events-auto shadow-lg-up">
            <nav className="flex justify-around items-center h-20 pb-2">
              <button 
                onClick={() => setView('dashboard')}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${view === 'dashboard' ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Home className={`w-6 h-6 ${view === 'dashboard' ? 'fill-current' : ''}`} strokeWidth={view === 'dashboard' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Início</span>
              </button>
              
              {/* New Tools Tab */}
              <button 
                onClick={() => setView('tools')}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${view === 'tools' ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGridIcon className={`w-6 h-6 ${view === 'tools' ? 'fill-current' : ''}`} strokeWidth={view === 'tools' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Ferramentas</span>
              </button>

              <button 
                onClick={() => setView('vaccines')}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${view === 'vaccines' ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Syringe className={`w-6 h-6 ${view === 'vaccines' ? 'fill-current' : ''}`} strokeWidth={view === 'vaccines' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Vacinas</span>
              </button>
              <button 
                onClick={() => setView('profile')}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${view === 'profile' ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <User className={`w-6 h-6 ${view === 'profile' ? 'fill-current' : ''}`} strokeWidth={view === 'profile' ? 2.5 : 2} />
                <span className="text-[10px] font-medium">Perfil</span>
              </button>
            </nav>
          </div>
        </div>

      </div>
    </div>
  );
}

const SimpleCharts = ({ trackers, growthLogs }: { trackers: TrackerLog[]; growthLogs: GrowthLog[] }) => {
  const today = getTodayString();
  const isSameDay = (ts: number) => new Date(ts).toDateString() === new Date().toDateString();
  const feedsToday = trackers.filter(t => (t.type === 'feed_left' || t.type === 'feed_right' || t.type === 'bottle') && isSameDay(t.timestamp)).length;
  const diapersToday = trackers.filter(t => t.type === 'diaper' && isSameDay(t.timestamp)).length;
  const lastGrowth = growthLogs[growthLogs.length - 1];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="text-xs text-slate-500">Mamadas/Hoje</div>
          <div className="text-3xl font-bold">{feedsToday}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">Fraldas/Hoje</div>
          <div className="text-3xl font-bold">{diapersToday}</div>
        </Card>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="text-xs text-slate-500 mb-2">Crescimento</div>
        <div className="flex items-end gap-6">
          <div className="flex-1">
            <div className="h-24 bg-rose-100 rounded-lg flex items-end">
              <div style={{ height: `${(lastGrowth?.weight ?? 3) * 10}px` }} className="w-6 bg-rose-500 rounded-lg mx-auto transition-all" />
            </div>
            <div className="text-center text-xs mt-1">Peso</div>
          </div>
          <div className="flex-1">
            <div className="h-24 bg-indigo-100 rounded-lg flex items-end">
              <div style={{ height: `${(lastGrowth?.height ?? 49) * 1}px` }} className="w-6 bg-indigo-500 rounded-lg mx-auto transition-all" />
            </div>
            <div className="text-center text-xs mt-1">Altura</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoutineQuestionnaire = ({ onDone }: { onDone: () => void }) => {
  const [goal, setGoal] = useState('sono');
  const [time, setTime] = useState('30');
  const [days, setDays] = useState('7');
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onDone(); }}>
      <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" value={goal} onChange={(e) => setGoal(e.target.value)}>
        <option value="sono">Melhorar o sono</option>
        <option value="colicas">Reduzir cólicas</option>
        <option value="amamentacao">Amamentação</option>
      </select>
      <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" value={time} onChange={(e) => setTime(e.target.value)}>
        <option value="15">15 min/dia</option>
        <option value="30">30 min/dia</option>
        <option value="60">60 min/dia</option>
      </select>
      <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500" value={days} onChange={(e) => setDays(e.target.value)}>
        <option value="7">7 dias</option>
        <option value="14">14 dias</option>
        <option value="28">28 dias</option>
      </select>
      <Button className="w-full h-12">Gerar Rotina</Button>
    </form>
  );
};

const SpiritualityModule = () => {
  const [active, setActive] = useState(true);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">Ativar devocional</span>
        <input type="checkbox" checked={active} onChange={() => setActive(!active)} />
      </div>
      {active && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-sm">Reflexão do dia</span>
          </div>
          <div className="text-sm text-slate-700">“O amor é paciente, o amor é bondoso.”</div>
        </Card>
      )}
    </div>
  );
};

const CommunityFeed = () => {
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





const SettingsPanel = ({ onClose, onChangeAds }: { onClose: () => void; onChangeAds: (v: boolean) => void }) => {
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

const AdminPanel = ({ 
  user, 
  onLogout
}: { 
  user: UserData | null; 
  onLogout: () => void;
}) => {
  const [tab, setTab] = useState<'dashboard' | 'users' | 'missions' | 'vaccines' | 'ads' | 'notifications' | 'settings'>('dashboard');
  
  // Data States
  const [adminUsers, setAdminUsers] = useState<UserData[]>([]);
  const [adminVaccines, setAdminVaccines] = useState<VaccineTemplate[]>([]);
  const [adminMissions, setAdminMissions] = useState<Challenge[]>([]);
  const [adminAdConfig, setAdminAdConfig] = useState<AdConfig>({ enabled: false, clientId: '', slots: { dashboard: '' } });
  const [adminNotifications, setAdminNotifications] = useState<PushNotification[]>([]);
  
  const [priceMonthly, setPriceMonthly] = useState('19.90');
  const [priceAnnual, setPriceAnnual] = useState('149.90');
  const [localXp, setLocalXp] = useState<Record<ChallengeCategory, number>>({
    afeto: 15, motor: 15, cognitivo: 15, nutricao: 15, sono: 15, saude_mae: 50
  });
  
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, vaccines, missions, ads, push] = await Promise.all([
          api.admin.getUsers(),
          api.admin.getVaccines(),
          api.admin.getMissions(),
          api.admin.getAdConfig(),
          api.admin.getPushHistory()
        ]);
        setAdminUsers(users);
        setAdminVaccines(vaccines);
        setAdminMissions(missions);
        setAdminAdConfig(ads);
        setAdminNotifications(push);
      } catch (err) {
        console.error(err);
        showToast('Erro ao carregar dados do painel', 'error');
      }
    };
    fetchData();
  }, []);

  // New Mission State
  const [newMission, setNewMission] = useState({ title: '', description: '', category: 'afeto' as ChallengeCategory, minAgeWeeks: 0, durationMinutes: 5 });

  // New Vaccine State
  const [newVaccine, setNewVaccine] = useState({ name: '', daysFromBirth: 0, description: '' });

  // New Notification State
  const [newPush, setNewPush] = useState({ title: '', body: '', audience: 'all' });


  return (
    <div className="flex h-full bg-slate-50 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-[slideIn_300ms] ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex-col hidden md:flex rounded-r-2xl shadow-xl z-10">
        <div className="p-6">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <Settings className="w-6 h-6 text-rose-500" />
            Zela Admin
          </h2>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {[
            { id: 'dashboard', label: 'Visão Geral', icon: BarChart3 },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'missions', label: 'Conteúdo', icon: ClipboardList },
            { id: 'vaccines', label: 'Vacinas', icon: Syringe },
            { id: 'ads', label: 'Propagandas', icon: Megaphone },
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'settings', label: 'Configurações', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                tab === item.id 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            <div className="text-xs">
              <div className="text-white font-medium">Admin</div>
              <div className="text-slate-500">admin@zela.com</div>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-red-500/10 hover:text-red-500 text-slate-400 text-xs font-bold transition-all">
            <LogOut className="w-3 h-3" /> Sair
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header for Admin */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-20">
           <span className="font-bold">Zela Admin</span>
           <div className="flex gap-2">
             {['dashboard', 'users', 'missions'].map(t => (
               <button key={t} onClick={() => setTab(t as any)} className={`p-2 rounded-lg ${tab === t ? 'bg-rose-500' : 'bg-slate-800'}`}>
                 {t === 'dashboard' ? <BarChart3 className="w-4 h-4" /> : t === 'users' ? <Users className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
               </button>
             ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              {tab === 'dashboard' ? 'Visão Geral' : 
               tab === 'users' ? 'Gestão de Usuários' : 
               tab === 'missions' ? 'Conteúdo & Missões' : 
               tab === 'vaccines' ? 'Calendário Vacinal' : 
               tab === 'ads' ? 'Gestão de Anúncios' : 
               tab === 'notifications' ? 'Push Notifications' : 
               'Configurações do Sistema'}
            </h1>
            <div className="text-sm text-slate-500">{new Date().toLocaleDateString()}</div>
          </div>

          {tab === 'dashboard' && (
            <div className="space-y-6 animate-[fadeIn_300ms]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-6 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-500" /></div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">R$ 4.290</div>
                  <div className="text-xs text-slate-500 mt-1">MRR (Receita Mensal)</div>
                </Card>
                <Card className="p-6 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg"><Users className="w-5 h-5 text-indigo-500" /></div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">+5 hoje</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{adminUsers.length}</div>
                  <div className="text-xs text-slate-500 mt-1">Usuários Ativos</div>
                </Card>
                <Card className="p-6 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-rose-50 rounded-lg"><Star className="w-5 h-5 text-rose-500" /></div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">4.2% Conv.</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">89</div>
                  <div className="text-xs text-slate-500 mt-1">Assinantes Premium</div>
                </Card>
                <Card className="p-6 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg"><Activity className="w-5 h-5 text-amber-500" /></div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Baixo</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">1.2%</div>
                  <div className="text-xs text-slate-500 mt-1">Churn Rate</div>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">Últimas Vendas</h3>
                  <div className="space-y-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">R$</div>
                          <div>
                            <div className="font-medium text-slate-900">Assinatura Anual</div>
                            <div className="text-xs text-slate-500">há {i * 12} min</div>
                          </div>
                        </div>
                        <div className="font-bold text-emerald-600">+ R$ 149,90</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">Novos Usuários</h3>
                  <div className="space-y-4">
                    {adminUsers.map(u => (
                      <div key={u.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </div>
                        </div>
                        <Badge variant="neutral">Grátis</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-4 animate-[fadeIn_300ms]">
              <Card className="overflow-hidden border border-slate-200">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                   <div className="relative">
                     <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                     <input className="pl-9 h-10 rounded-lg border border-slate-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Buscar por nome ou email..." />
                   </div>
                   <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Adicionar Usuário</Button>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="p-4">Usuário</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Plano</th>
                      <th className="p-4">Pontos</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="p-4"><Badge variant="success" className="bg-emerald-100 text-emerald-700">Ativo</Badge></td>
                        <td className="p-4"><Badge variant="neutral">Free</Badge></td>
                        <td className="p-4 font-mono text-slate-600">{u.points}</td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900"><MoreHorizontal className="w-4 h-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {tab === 'missions' && (
            <div className="grid md:grid-cols-3 gap-6 animate-[fadeIn_300ms]">
              <div className="md:col-span-1 space-y-6">
                <Card className="p-6 space-y-4 bg-white border border-slate-200 shadow-sm sticky top-6">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-rose-500" /> Nova Missão
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Título</label>
                      <input 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none" 
                        placeholder="Ex: Banho de Sol" 
                        value={newMission.title}
                        onChange={e => setNewMission({...newMission, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Categoria</label>
                      <select 
                        className="w-full h-10 px-2 rounded-lg border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        value={newMission.category}
                        onChange={e => setNewMission({...newMission, category: e.target.value as any})}
                      >
                        <option value="afeto">Afeto</option>
                        <option value="motor">Motor</option>
                        <option value="cognitivo">Cognitivo</option>
                        <option value="sono">Sono</option>
                        <option value="nutricao">Nutrição</option>
                        <option value="saude_mae">Saúde Mãe</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Idade Mínima (Semanas)</label>
                      <input 
                          type="number" 
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none" 
                          value={newMission.minAgeWeeks}
                          onChange={e => setNewMission({...newMission, minAgeWeeks: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição</label>
                      <textarea 
                        className="w-full h-32 px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:ring-2 focus:ring-rose-500 focus:outline-none" 
                        placeholder="Explique como realizar a missão..." 
                        value={newMission.description}
                        onChange={e => setNewMission({...newMission, description: e.target.value})}
                      />
                    </div>
                    <Button className="w-full h-12 shadow-lg shadow-rose-200" onClick={async () => {
                      if (newMission.title && newMission.description) {
                        try {
                          const saved = await api.admin.createMission(newMission);
                          setAdminMissions([saved, ...adminMissions]);
                          setNewMission({ title: '', description: '', category: 'afeto', minAgeWeeks: 0, durationMinutes: 5 });
                          showToast('Missão criada com sucesso!', 'success');
                        } catch (e) { showToast('Erro ao criar missão', 'error'); }
                      }
                    }}>Publicar Missão</Button>
                  </div>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Biblioteca de Missões ({adminMissions.length})</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Filtrar</Button>
                    <Button size="sm" variant="outline">Exportar</Button>
                  </div>
                </div>
                <div className="grid gap-3">
                  {adminMissions.slice().reverse().map(m => (
                    <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-start hover:border-rose-200 transition-all group">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="neutral" className="text-[10px] uppercase tracking-wider">{m.category}</Badge>
                          <span className="text-[10px] text-slate-400 font-medium">+{m.minAgeWeeks} semanas</span>
                        </div>
                        <div className="font-bold text-slate-900">{m.title}</div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-md">{m.description}</div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-500"><Settings className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'vaccines' && (
            <div className="space-y-6 animate-[fadeIn_300ms]">
              <Card className="p-6 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-500" /> Adicionar Nova Vacina
                </h3>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome da Vacina</label>
                    <input 
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm" 
                      placeholder="Ex: BCG" 
                      value={newVaccine.name}
                      onChange={e => setNewVaccine({...newVaccine, name: e.target.value})}
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Dias (Idade)</label>
                    <input 
                        type="number" 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm" 
                        placeholder="0" 
                        value={newVaccine.daysFromBirth || ''}
                        onChange={e => setNewVaccine({...newVaccine, daysFromBirth: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição</label>
                    <input 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm" 
                        placeholder="Protege contra..." 
                        value={newVaccine.description}
                        onChange={e => setNewVaccine({...newVaccine, description: e.target.value})}
                    />
                  </div>
                  <Button className="h-10 px-6 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={async () => {
                    if (newVaccine.name) {
                      try {
                        const saved = await api.admin.createVaccine(newVaccine);
                        setAdminVaccines([...adminVaccines, saved]);
                        setNewVaccine({ name: '', daysFromBirth: 0, description: '' });
                        showToast('Vacina adicionada!', 'success');
                      } catch (e) { showToast('Erro ao salvar vacina', 'error'); }
                    }
                  }}>Salvar</Button>
                </div>
              </Card>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="p-4">Idade</th>
                      <th className="p-4">Vacina</th>
                      <th className="p-4">Descrição</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminVaccines.sort((a,b) => a.daysFromBirth - b.daysFromBirth).map(v => (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono text-slate-600">{v.daysFromBirth} dias</td>
                        <td className="p-4 font-bold text-slate-900">{v.name}</td>
                        <td className="p-4 text-slate-500">{v.description}</td>
                        <td className="p-4 text-right">
                          <button onClick={async () => {
                            try {
                              await api.admin.deleteVaccine(v.id);
                              setAdminVaccines(adminVaccines.filter(x => x.id !== v.id));
                              showToast('Vacina removida', 'success');
                            } catch (e) { showToast('Erro ao remover', 'error'); }
                          }} className="text-slate-400 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'ads' && (
            <div className="space-y-6 animate-[fadeIn_300ms]">
              <Card className="p-6 bg-white border border-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div className="p-2 bg-rose-50 rounded-lg"><Megaphone className="w-5 h-5 text-rose-500" /></div>
                  <div>
                    <h3 className="font-bold text-slate-900">Configuração de Anúncios (AdSense/AdMob)</h3>
                    <p className="text-xs text-slate-500">Gerencie os blocos de anúncios do app</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-6">
                  <span className="text-sm font-bold text-slate-700">Ativar Anúncios no App</span>
                  <div 
                    onClick={() => setAdminAdConfig({ ...adminAdConfig, enabled: !adminAdConfig.enabled })}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${adminAdConfig.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${adminAdConfig.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Google Ad Client ID</label>
                    <input 
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono" 
                      placeholder="ca-pub-XXXXXXXXXXXXXXXX" 
                      value={adminAdConfig.clientId}
                      onChange={e => setAdminAdConfig({...adminAdConfig, clientId: e.target.value})}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Encontrado no seu painel do AdSense/AdMob.</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-3 text-sm">Blocos de Anúncios (Slots)</h4>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Dashboard Banner ID</label>
                      <input 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono" 
                        placeholder="1234567890" 
                        value={adminAdConfig.slots.dashboard}
                        onChange={e => setAdminAdConfig({...adminAdConfig, slots: { ...adminAdConfig.slots, dashboard: e.target.value }})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="h-10 px-6 bg-rose-500 hover:bg-rose-600 text-white" onClick={async () => {
                      try {
                        await api.admin.updateAdConfig(adminAdConfig);
                        showToast('Configurações de anúncios salvas!', 'success');
                      } catch (e) { showToast('Erro ao salvar config', 'error'); }
                    }}>
                      Salvar Configurações
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-6 animate-[fadeIn_300ms]">
               <Card className="p-6 bg-white border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-500" /> Enviar Notificação Push
                </h3>
                <div className="space-y-4">
                   <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Título</label>
                    <input 
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm" 
                      placeholder="Ex: Hora da Vacina!" 
                      value={newPush.title}
                      onChange={e => setNewPush({...newPush, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mensagem</label>
                    <textarea 
                      className="w-full h-24 px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none" 
                      placeholder="Digite a mensagem..." 
                      value={newPush.body}
                      onChange={e => setNewPush({...newPush, body: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Público Alvo</label>
                    <select 
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white"
                      value={newPush.audience}
                      onChange={e => setNewPush({...newPush, audience: e.target.value})}
                    >
                      <option value="all">Todos os Usuários</option>
                      <option value="free">Apenas Freemium</option>
                      <option value="premium">Apenas Premium</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      if ('Notification' in window) {
                        Notification.requestPermission().then(permission => {
                          if (permission === 'granted') {
                            new Notification(newPush.title || 'Teste', { body: newPush.body || 'Corpo do teste', icon: '/logo.png' });
                            showToast('Notificação de teste enviada para este aparelho', 'success');
                          } else {
                            showToast('Permissão negada pelo navegador', 'error');
                          }
                        });
                      } else {
                        showToast('Navegador não suporta notificações', 'error');
                      }
                    }}>Testar no meu aparelho</Button>
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white" onClick={async () => {
                      if (newPush.title && newPush.body) {
                        try {
                          const saved = await api.admin.sendPush(newPush);
                          setAdminNotifications([saved, ...adminNotifications]);
                          setNewPush({ title: '', body: '', audience: 'all' });
                          showToast(`Enviado para ${newPush.audience === 'all' ? 'todos' : newPush.audience} com sucesso!`, 'success');
                        } catch (e) { showToast('Erro ao enviar push', 'error'); }
                      }
                    }}>Enviar Push <Megaphone className="w-4 h-4 ml-2" /></Button>
                  </div>
                </div>
               </Card>

               <div className="space-y-4">
                 <h3 className="font-bold text-slate-900">Histórico de Envios</h3>
                 <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="p-4">Data</th>
                          <th className="p-4">Título</th>
                          <th className="p-4">Mensagem</th>
                          <th className="p-4">Público</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminNotifications.map(n => (
                          <tr key={n.id}>
                            <td className="p-4 text-slate-500">{new Date(n.sentAt).toLocaleString()}</td>
                            <td className="p-4 font-bold text-slate-900">{n.title}</td>
                            <td className="p-4 text-slate-600 truncate max-w-xs">{n.body}</td>
                            <td className="p-4"><Badge variant="neutral">{n.audience}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="grid md:grid-cols-2 gap-6 animate-[fadeIn_300ms]">
              <Card className="p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg"><Activity className="w-5 h-5 text-indigo-500" /></div>
                  <div>
                    <h3 className="font-bold text-slate-900">Gamificação & XP</h3>
                    <p className="text-xs text-slate-500">Calibre a dificuldade do app</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(localXp).map((cat) => (
                    <div key={cat}>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{cat}</label>
                      <div className="flex items-center gap-2">
                        <input 
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono" 
                          value={localXp[cat as ChallengeCategory]} 
                          onChange={(e) => setLocalXp({ ...localXp, [cat]: parseInt(e.target.value || '0') })} 
                        />
                        <span className="text-xs text-slate-400">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-12" onClick={() => { 
                  // TODO: Implement XP Config API
                  showToast('Configurações de XP salvas!', 'success'); 
                }}>Salvar Alterações</Button>
              </Card>

              <Card className="p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-500" /></div>
                  <div>
                    <h3 className="font-bold text-slate-900">Preços & Planos</h3>
                    <p className="text-xs text-slate-500">Controle do Stripe</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Mensal (R$)</label>
                    <input className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold" value={priceMonthly} onChange={(e) => setPriceMonthly(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Anual (R$)</label>
                    <input className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold" value={priceAnnual} onChange={(e) => setPriceAnnual(e.target.value)} />
                  </div>
                  <Button variant="outline" className="w-full h-12" onClick={() => showToast('Sincronizando com Stripe...', 'success')}>Sincronizar com Stripe</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdBox = ({ config }: { config?: AdConfig }) => {
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

// Icon wrapper for LayoutGrid since it's used in Nav
const LayoutGridIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
