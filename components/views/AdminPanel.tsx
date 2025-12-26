import React, { useState, useEffect } from 'react';
import { 
  Settings, LogOut, BarChart3, Users, ClipboardList, Syringe, Megaphone, Bell, 
  TrendingUp, Star, Activity, CheckCircle2, ShieldCheck, Search, Plus, MoreHorizontal, Trash2, User 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../api';
import { UserData, VaccineTemplate, Challenge, AdConfig, PushNotification, ChallengeCategory } from '../../types';

interface AdminPanelProps { 
  user: UserData | null; 
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout }) => {
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
        <div className="md:hidden bg-slate-900 text-white p-4 flex flex-col gap-3 sticky top-0 z-20 shadow-lg">
           <div className="flex justify-between items-center">
             <span className="font-bold text-lg">Zela Admin</span>
             <button onClick={onLogout} className="p-2 bg-slate-800 rounded-lg text-red-400">
               <LogOut className="w-4 h-4" />
             </button>
           </div>
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             {[
               { id: 'dashboard', icon: BarChart3 },
               { id: 'users', icon: Users },
               { id: 'missions', icon: ClipboardList },
               { id: 'vaccines', icon: Syringe },
               { id: 'ads', icon: Megaphone },
               { id: 'notifications', icon: Bell },
               { id: 'settings', icon: Settings },
             ].map(t => (
               <button key={t.id} onClick={() => setTab(t.id as any)} className={`p-3 rounded-xl flex-shrink-0 transition-all ${tab === t.id ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-800 text-slate-400'}`}>
                 <t.icon className="w-5 h-5" />
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
