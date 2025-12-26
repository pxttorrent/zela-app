import React, { useRef } from 'react';
import { 
  Heart, Flame, LineChart, ShieldCheck, MessageCircle, 
  ClipboardList, BarChart3, Music, Users, BookOpen, 
  Star, CheckCircle2, X, ChevronRight 
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export const SalesLanding = ({ canContinue, onContinue, onStartFree, onSubscribe }: { canContinue: boolean; onContinue: () => void; onStartFree: () => void; onSubscribe: () => void }) => {
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 lg:px-20 bg-gradient-to-b from-rose-50/50 to-white text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_800ms_ease-out]">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Zela Logo" className="w-32 h-32 rounded-[28px] shadow-lg shadow-rose-200" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/50 text-rose-600 font-bold text-xs uppercase tracking-widest mx-auto">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            Guia Completo 0–12 meses
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Menos ansiedade. <br className="hidden md:block"/>Mais clareza no dia a dia com seu bebê.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Rotina personalizada, lembretes, missões diárias, relatórios e comunidade para você sentir que está no controle do cuidado.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-rose-200" onClick={onStartFree}>Começar no freemium</Button>
            <Button variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto" onClick={scrollToCta}>Ver planos</Button>
          </div>
          {canContinue && (
            <div className="pt-4">
              <Button variant="ghost" className="text-slate-500 hover:text-rose-600 transition-colors" onClick={onContinue}>
                Continuar onde parei <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* PAIN POINTS (Carousel on Mobile) */}
      <section className="px-6 lg:px-20 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-rose-500 uppercase tracking-widest">Desafios da Maternidade</div>
          <h3 className="text-3xl font-extrabold text-slate-900">Você não precisa “lembrar de tudo” sozinha</h3>
        </div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 no-scrollbar md:grid md:grid-cols-4 md:gap-6">
          <Card className="snap-center min-w-[260px] p-6 hover:shadow-lg transition-all border-l-4 border-l-rose-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-rose-100 rounded-lg"><Flame className="w-5 h-5 text-rose-500" /></div>
              <div className="font-bold text-lg">Rotina caótica</div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">Sono, mamadas e fraldas viram um quebra-cabeça diário.</p>
          </Card>
          <Card className="snap-center min-w-[260px] p-6 hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-indigo-100 rounded-lg"><LineChart className="w-5 h-5 text-indigo-500" /></div>
               <div className="font-bold text-lg">Ansiedade</div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">“Estou fazendo certo?” sem evidências claras do progresso.</p>
          </Card>
          <Card className="snap-center min-w-[260px] p-6 hover:shadow-lg transition-all border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-emerald-100 rounded-lg"><ShieldCheck className="w-5 h-5 text-emerald-500" /></div>
               <div className="font-bold text-lg">Vacinas</div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">Datas importantes se misturam no meio do cansaço.</p>
          </Card>
          <Card className="snap-center min-w-[260px] p-6 hover:shadow-lg transition-all border-l-4 border-l-amber-500">
            <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-amber-100 rounded-lg"><MessageCircle className="w-5 h-5 text-amber-500" /></div>
               <div className="font-bold text-lg">Solidão</div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">Falta de troca com quem vive a mesma fase.</p>
          </Card>
        </div>
      </section>

      {/* METHOD */}
      <section className="bg-slate-50 py-16 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="text-center space-y-2">
             <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Nosso Método</div>
             <h3 className="text-3xl font-extrabold text-slate-900">Um sistema simples que vira hábito</h3>
           </div>
           
           <div className="space-y-6">
             <div className="flex flex-col md:flex-row gap-6 items-center">
               <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-rose-500 shrink-0">1</div>
               <div className="flex-1 text-center md:text-left">
                 <h4 className="text-xl font-bold text-slate-900">Defina o objetivo</h4>
                 <p className="text-slate-600 mt-1">Você responde um questionário rápido e o Zela organiza um plano personalizado para o momento do seu bebê.</p>
               </div>
             </div>
             <div className="w-0.5 h-12 bg-slate-200 ml-8 hidden md:block"></div>
             <div className="flex flex-col md:flex-row gap-6 items-center">
               <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-indigo-500 shrink-0">2</div>
               <div className="flex-1 text-center md:text-left">
                 <h4 className="text-xl font-bold text-slate-900">Execute missões diárias</h4>
                 <p className="text-slate-600 mt-1">Micro-ações guiadas por semana de vida. Gamificado para você sentir que está evoluindo junto com ele.</p>
               </div>
             </div>
             <div className="w-0.5 h-12 bg-slate-200 ml-8 hidden md:block"></div>
             <div className="flex flex-col md:flex-row gap-6 items-center">
               <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-emerald-500 shrink-0">3</div>
               <div className="flex-1 text-center md:text-left">
                 <h4 className="text-xl font-bold text-slate-900">Veja o progresso</h4>
                 <p className="text-slate-600 mt-1">Relatórios automáticos de sono, alimentação e crescimento. Dados que acalmam o coração.</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="px-6 lg:px-20 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Funcionalidades</div>
          <h3 className="text-3xl font-extrabold text-slate-900">Tudo em um só lugar</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: ClipboardList, color: 'rose', title: 'Rotina', desc: 'Plano personalizado.' },
            { icon: BarChart3, color: 'indigo', title: 'Relatórios', desc: 'Visualize a evolução.' },
            { icon: ShieldCheck, color: 'emerald', title: 'Carteirinha', desc: 'Vacinas organizadas.' },
            { icon: Music, color: 'indigo', title: 'Ruído Branco', desc: 'Ajuda para o sono.' },
            { icon: Users, color: 'rose', title: 'Comunidade', desc: 'Troca sem julgamento.' },
            { icon: BookOpen, color: 'amber', title: 'Espiritualidade', desc: 'Devocional diário.' }
          ].map((item, idx) => (
            <Card key={idx} className="p-6 hover:scale-[1.02] transition-transform cursor-default">
              <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 text-${item.color}-500`} />
              </div>
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-6 lg:px-20 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
           <div className="text-xs font-bold text-amber-500 uppercase tracking-widest">Depoimentos</div>
           <h3 className="text-3xl font-extrabold text-slate-900">Quem usa, ama</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 bg-slate-50 border-none">
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-slate-700 font-medium text-lg italic">“Pare de viver no modo sobrevivência. Com missões pequenas, eu consegui criar rotina sem me culpar.”</p>
            <div className="mt-6 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-rose-200"></div>
               <div>
                 <div className="font-bold text-sm">Ana</div>
                 <div className="text-xs text-slate-500">Mãe de primeira viagem</div>
               </div>
            </div>
          </Card>
          <Card className="p-8 bg-slate-50 border-none">
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-slate-700 font-medium text-lg italic">“Os relatórios me acalmaram muito. Ver a evolução do cuidado diminuiu minha ansiedade.”</p>
            <div className="mt-6 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-indigo-200"></div>
               <div>
                 <div className="font-bold text-sm">Camila</div>
                 <div className="text-xs text-slate-500">Mãe do Noah</div>
               </div>
            </div>
          </Card>
        </div>
      </section>

      {/* PRICING */}
      <section ref={ctaRef} className="px-6 lg:px-20 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
           <div className="text-xs font-bold text-rose-500 uppercase tracking-widest">Planos</div>
           <h3 className="text-3xl font-extrabold text-slate-900">Escolha como começar</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* FREE */}
          <Card className="p-8 border-slate-200 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="text-2xl font-bold text-slate-900">Freemium</h3>
                 <p className="text-sm text-slate-500">Para conhecer.</p>
               </div>
               <Badge variant="neutral">Grátis</Badge>
            </div>
            <div className="text-3xl font-bold mb-6 text-slate-900">R$ 0 <span className="text-sm font-normal text-slate-500">/mês</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Missões diárias</li>
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ferramentas essenciais</li>
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Comunidade</li>
              <li className="flex items-center gap-2 text-sm text-slate-400"><X className="w-4 h-4" /> Relatórios avançados</li>
              <li className="flex items-center gap-2 text-sm text-slate-400"><X className="w-4 h-4" /> Sem anúncios</li>
            </ul>
            <Button variant="outline" className="w-full h-12" onClick={onStartFree}>Começar Grátis</Button>
          </Card>

          {/* PREMIUM */}
          <Card className="p-8 border-rose-200 bg-gradient-to-br from-white to-rose-50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Recomendado</div>
            <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="text-2xl font-bold text-slate-900">Premium</h3>
                 <p className="text-sm text-slate-500">Experiência completa.</p>
               </div>
            </div>
            <div className="text-3xl font-bold mb-6 text-slate-900">R$ 19,90 <span className="text-sm font-normal text-slate-500">/mês</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-rose-500" /> Tudo do Free</li>
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-rose-500" /> <b>Sem anúncios</b></li>
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-rose-500" /> Relatórios completos</li>
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-rose-500" /> Rotina Personalizada</li>
            </ul>
            <Button className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white border-none shadow-lg shadow-rose-200" onClick={onSubscribe}>
              Assinar Agora
            </Button>
            <p className="text-center text-[10px] text-slate-500 mt-4">Cancele quando quiser.</p>
          </Card>

          {/* FAMILY */}
          <Card className="p-8 border-indigo-200 bg-gradient-to-br from-white to-indigo-50 shadow-lg relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="text-2xl font-bold text-slate-900">Família</h3>
                 <p className="text-sm text-slate-500">Para o casal.</p>
               </div>
               <Badge className="bg-indigo-100 text-indigo-700">Dupla</Badge>
            </div>
            <div className="text-3xl font-bold mb-6 text-slate-900">R$ 29,90 <span className="text-sm font-normal text-slate-500">/mês</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Tudo do Premium</li>
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 2 Responsáveis (Pai + Mãe)</li>
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Dados sincronizados</li>
              <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Relatórios unificados</li>
            </ul>
            <Button className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white border-none shadow-lg shadow-indigo-200" onClick={onSubscribe}>
              Assinar Família
            </Button>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-slate-400 text-xs py-10 border-t border-slate-50 mt-10">
        <p>&copy; 2025 Zela App. Feito com amor para famílias.</p>
      </footer>
    </div>
  );
};
