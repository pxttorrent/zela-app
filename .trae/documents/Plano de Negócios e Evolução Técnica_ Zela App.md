# Plano de Negócios e Roteiro Técnico: Zela App

Este documento detalha a viabilidade, projeção financeira e o plano de ação para transformar o protótipo atual em um produto SaaS (Software as a Service) rentável.

## 1. Análise de Viabilidade de Negócio

### Estado Atual (MVP Local)
*   **Status:** Protótipo funcional de alta fidelidade.
*   **Limitações Críticas:**
    *   **Persistência:** Usa `localStorage` (se a mãe limpar o cache ou trocar de celular, perde tudo).
    *   **Backend:** Inexistente. Não há validação real de pagamentos, autenticação segura ou sincronização de dados (Modo Dupla não funciona de verdade).
    *   **Monetização:** Simulação visual. Não processa cartões de crédito.
*   **Veredito:** **Inviável comercialmente no estado atual**, mas excelente como prova de conceito e validação de UX.

### Potencial (Pós-Implementação)
*   **Nicho:** "Mães Cristãs/Espiritualizadas" + "Gamificação" é um diferencial forte num mercado saturado de apps puramente médicos.
*   **Dor do Cliente:** A ansiedade do primeiro filho e a necessidade de controle (vacinas, sono, mamada). O app resolve isso centralizando ferramentas dispersas.
*   **Viabilidade:** **Alta**. O modelo de recorrência (assinatura) para apps de bebê é validado (LTV alto nos primeiros 12-24 meses).

---

## 2. Projeção Financeira (12 Meses)

Considerando o modelo **Freemium** (Ads + Assinatura R$ 19,90/mês ou R$ 149,90/ano).

| Fase | Período | Meta de Usuários | Conversão (Assinantes) | Faturamento Estimado | Custo (Infra + Mkt) | Lucro Líquido |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Validação** | Mês 1-3 | 500 (Beta) | 0% | R$ 0 | R$ 500 | -R$ 500 |
| **Lançamento** | Mês 4-6 | 5.000 | 2% (100) | R$ 2.000/mês | R$ 1.500 | R$ 500 |
| **Tração** | Mês 7-9 | 20.000 | 3% (600) | R$ 12.000/mês | R$ 4.000 | R$ 8.000 |
| **Escala** | Mês 10-12 | 50.000 | 4% (2.000) | R$ 40.000/mês | R$ 10.000 | **R$ 30.000** |

*   **Cenário Conservador (1 ano):** Lucro acumulado de R$ 30k - R$ 50k.
*   **Cenário Otimista (Viralização/Influencers):** Lucro acumulado de R$ 100k+.
*   **Fator Chave:** O *Churn* (cancelamento). O app precisa ser útil após os 6 primeiros meses para manter a assinatura.

---

## 3. Melhorias Estratégicas

### A. Para o Usuário Final (Mãe/Pai) - Foco em Retenção
1.  **IA Real (Pediatra 24h):** Integrar API do Gemini/OpenAI de verdade. Treinar a IA com diretrizes médicas seguras para responder dúvidas de madrugada.
2.  **Relatórios em PDF:** Botão "Exportar para Pediatra". Gera um PDF bonito com curva de crescimento e padrão de sono para levar na consulta. Isso agrega valor profissional.
3.  **Ruído Branco em Background:** O app precisa tocar o som mesmo com a tela bloqueada (necessário implementação nativa/PWA robusta).
4.  **Diário de Memórias:** Upload de 1 foto por dia (estilo BeReal) para gerar um timelapse do bebê no final do ano. (Isso prende a mãe ao app).

### B. Para o Administrador (Você) - Foco em Vendas
1.  **Painel de Métricas (KPIs):**
    *   MRR (Receita Recorrente Mensal).
    *   CAC (Custo por Aquisição).
    *   Churn Rate (Taxa de cancelamento).
2.  **Gestor de Push Notifications:**
    *   Agendar "dicas do dia" baseadas na idade do bebê (ex: "Seu bebê tem 3 meses, já tentou tummy time hoje?"). Isso traz o usuário de volta.
3.  **Controle de Assinaturas (Stripe/MercadoPago):**
    *   Ver quem está inadimplente.
    *   Criar cupons de desconto ("ZELA50").
4.  **Gestão de Conteúdo (CMS):**
    *   Poder adicionar novos desafios e devocionais sem precisar programar/atualizar o app na loja.

---

## 4. Plano de Ação Técnico (Next Steps)

Para tornar o app "assinável", precisamos sair do protótipo para a produção.

### Fase 1: Infraestrutura Real (Prioridade Imediata)
1.  **Banco de Dados:** Configurar Postgres (Neon) para salvar usuários, bebês e logs.
2.  **Autenticação:** Implementar login real (Google/Email) com segurança (JWT/Supabase Auth/Clerk).
3.  **Backend API:** Criar rotas para salvar/ler dados do banco.

### Fase 2: Monetização & Pagamentos
1.  **Integração Stripe/MercadoPago:**
    *   Webhook para liberar acesso Premium automaticamente após pagamento.
    *   Portal do cliente para cancelar/alterar cartão.
2.  **Bloqueio de Features:** Implementar lógica real no backend que impede acesso a "Relatórios Avançados" para usuários Free.

### Fase 3: Deploy & Lojas
1.  **Hospedagem:** Vercel ou Netlify (Frontend) + Render ou Railway (Backend).
2.  **PWA/Lojas:** Refinar o PWA para instalação fácil ou usar CapacitorJS para publicar na Apple App Store e Google Play Store.

---

**Recomendação Imediata:**
O próximo passo lógico é **implementar o Banco de Dados e a Autenticação Real**. Sem isso, não é possível cobrar nem reter usuários.

Posso começar configurando a conexão com o banco de dados (simulado ou real se fornecer credenciais) e a estrutura de API?