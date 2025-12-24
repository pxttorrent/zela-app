## Estado Atual do App
- Stack: `React` + `Vite` com Tailwind via CDN; dados em `localStorage`; sem backend.
- Vistas presentes: `landing`, `onboarding`, `dashboard`, `tools`, `vaccines`, `profile` em `index.tsx` (`/Users/filipevitolapeixoto/Downloads/zela/index.tsx:13`).
- Persistência: leitura/gravação em localStorage (`index.tsx:410–433`, `index.tsx:557`).
- Sem autenticação, sem roteamento real, sem gráficos, sem notificações, sem admin.

## Dores das Mães a Endereçar
- Lembrar rotinas e compromissos diários (sono, alimentação, vacinas, tarefas).
- Visualizar progresso do cuidado e desenvolvimento com clareza e motivação.
- Receber orientação personalizada conforme objetivos e fases do bebê.
- Evitar ruído/propagandas quando assinam; ter plano acessível quando não.
- Trocar experiências em comunidade confiável e moderada.

## Melhorias de UX/UI
- Tema feminino/aconchegante: paleta rosa/ametista, tipografia suave, cantos arredondados.
- Microinterações: estados hover/press animados, transições page-level, feedbacks visuais.
- Componentização: Botões, Cards, Badges, Modais, Stepper, Tabs.
- Layout responsivo mobile-first, PWA com ícone e splash.

## Páginas e Fluxos a Criar
- Login/Signup (email + social), recuperação de senha.
- Dashboard ampliado com cards de saúde, tarefas, próximos lembretes.
- Relatórios/Gráficos do cuidado (alimentação, sono, fraldas, crescimento).
- Rotina do bebê (builder via questionário + editor).
- Vacinas detalhadas com calendário, agendamentos e comprovantes.
- Comunidade (feed, posts, comentários, curtidas, moderação).
- Espiritualidade (conteúdo cristão opcional, diário/devocional).
- Assinatura/Checkout (planos, billing, histórico).
- Admin (assinaturas, planos, pontuações, desafios, conteúdo, moderação).
- Landing page de venda (funil completo, depoimentos, CTA, FAQ).
- Configurações (notificações, preferências, ads opt-in/out, privacidade).

## Freemium, Ads e Assinaturas
- Freemium com ads: integrar `Google AdSense/Ad Manager` no web; posicionar blocos não intrusivos.
- Assinaturas: integrar `Stripe` (Checkout, Portal, Webhooks) com planos `Monthly`, `Annual` e `Family`.
- Desbloqueios: remoção de ads, gráficos avançados, rotina personalizada, conteúdo premium.

## Painéis e Gráficos
- Métricas: feedings, sono, fraldas, banho, crescimento (peso/altura). KPIs e tendências.
- Gráficos: Recharts/Chart.js (linhas, barras, heatmaps de sono, distribuição de eventos).
- Exportação: PDF/CSV dos registros; compartilhamento com pediatra.

## Notificações Push
- PWA + Service Worker com Web Push (VAPID); opt-in por categoria.
- Scheduler diário para missões/desafios e vacinas; snooze e repetição.
- Backend agenda jobs (Node + cron/queue) disparando push.

## Rotina Personalizada
- Questionário objetivo (ex.: melhorar sono, cólicas, amamentação; tempo disponível; preferências).
- Algoritmo gera plano semanal com missões, lembretes e conteúdo explicativo.
- Editor de rotina: arrastar/soltar, prioridades, bloqueios de horário.

## Módulo de Espiritualidade (Opcional)
- Trilhas devocionais curtas (bíblico cristão) com reflexões e orações.
- Configurável por intensidade e frequência; lembretes.
- Respeito à privacidade e opção clara de ativar/desativar.

## Comunidade
- Feed de vitórias e dúvidas; comentários e reações.
- Moderação: reports, filtros de palavras, banimentos, termos de uso.
- Gamificação: badges por participação útil.

## Painel Administrativo
- Gestão de planos/valores, cupons, limites de recursos.
- CRUD de desafios/tarefas (pontuação por categoria), publicação de conteúdo.
- Moderação da comunidade; visão de métricas.
- Feature flags para lançar módulos gradualmente.

## Desafios 0–12 Meses
- Cobrir 0 a 52 semanas com 1–3 missões diárias por faixa etária.
- Categorias: afeto, motor, cognitivo, nutrição, sono, saúde da mãe.
- Pontuação configurável; níveis com nomes cativantes: `Broto`, `Ninho`, `Aurora`, `Cuidar`, `Abraço`, `Estrela`, `Brilho`, `Zela Mestre`.
- Popups animados ao completar desafio (pontuação subindo) e celebração ao alcançar nível.

## Arquitetura Técnica
- Frontend: `React` + `React Router`, Tailwind com config local, componentes UI.
- Backend: `Node/Express` ou `NestJS` com `Neon Postgres`; filas (BullMQ) para notificações.
- Autenticação: `JWT` + `Refresh` + `OAuth` (Google/Apple) e `Stripe` customer linking.
- PWA: Service Worker, caching, push, offline básico.

## Banco de Dados (Neon)
- `users`: perfil, auth, preferências, ads_opt_in.
- `babies`: user_id, nome, nascimento, gênero.
- `subscriptions`: user_id, plan_id, status, periodo, stripe_refs.
- `plans`: nome, preço, recursos (flags), limites.
- `payments`: subscription_id, valor, recibos.
- `ads_settings`: user_id, categorias bloqueadas.
- `challenge_templates`: categoria, idade_min/max, descrição, xp_base.
- `user_challenges`: user_id/baby_id, template_id, status, completed_at, xp_awarded.
- `tracker_logs`: baby_id, tipo (`feed_left/right`, `bottle`, `diaper`, `sleep`, `bath`), timestamp.
- `growth_logs`: baby_id, date, weight, height.
- `vaccine_templates`: nome, dias_do_nascimento, descrição.
- `user_vaccines`: baby_id, template_id, status, taken_at, due_date.
- `routines`: baby_id, nome, ativo, origem (questionário/manual).
- `routine_tasks`: routine_id, tarefa, horário, recorrência, prioridade.
- `spirituality_content`: título, texto, trilha, nível.
- `posts`: user_id, conteúdo, mídia, created_at.
- `comments`: post_id, user_id, texto.
- `likes`: post_id, user_id.
- `notifications`: user_id, tipo, payload, scheduled_at, sent_at.
- `admin_users`/`roles`: RBAC básico.

## Autenticação e Autorização
- Email/senha com verificação; OAuth.
- RBAC: `user`, `admin`; escopos por recurso.

## Segurança e Privacidade
- Criptografia em trânsito (HTTPS); senhas com `bcrypt`.
- Consentimento de dados, deleção de conta, portabilidade.
- Logs de auditoria em ações admin.

## Landing Page e Funil
- Seções: dor/benefícios, recursos, depoimentos, provas sociais, planos, FAQ, CTA.
- Pixel/analytics, e-mail capture, remarketing.

## Roadmap de Entrega
1. Fundações: roteamento, tema, auth, Neon + schema mínimo.
2. Trackers + gráficos básicos; vacinas; PWA e push.
3. Rotina personalizada + relatórios avançados; landing + checkout.
4. Comunidade + espiritualidade; admin completo; gamificação, níveis e celebrações.

## Referências no Código
- Vistas e estado atual em `index.tsx` (`/Users/filipevitolapeixoto/Downloads/zela/index.tsx:398–710`).
- Persistência local e limpeza em logout (`index.tsx:540–557`).

Confirma que seguimos com este plano? Posso começar pela base de roteamento, tema e schema Neon.