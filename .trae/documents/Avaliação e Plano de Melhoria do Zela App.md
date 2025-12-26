# Avaliação Técnica do Projeto Zela (Senior Full Stack Review)

## Notas por Categoria (0-10)

| Categoria | Nota | Justificativa |
| :--- | :---: | :--- |
| **Segurança** | **6.5** | Autenticação via JWT está correta, mas o armazenamento em `localStorage` é vulnerável a XSS. Falta validação de input (Zod/Joi) no backend. O segredo JWT tem um fallback hardcoded perigoso se o `.env` falhar. |
| **Arquitetura** | **4.0** | O frontend (`index.tsx`) é um "God Component" com mais de 2200 linhas. Mistura lógica de negócio, roteamento, UI e chamadas de API. Difícil de manter e testar. O backend está melhor estruturado. |
| **Qualidade de Código** | **5.0** | Uso excessivo de `any` no TypeScript. Componentes UI (Cards, Buttons) repetidos inline. Falta de padronização de tratamento de erros. |
| **Escalabilidade** | **6.0** | O uso de PostgreSQL (Neon) é excelente. O backend é stateless (Serverless-ready). O frontend monolítico vai pesar o bundle inicial. |
| **Profissionalismo** | **5.0** | Estrutura de pastas do frontend inexistente (tudo na raiz). Backend organizado. Faltam testes automatizados. |

---

## 🔍 Análise Detalhada e Pontos de Melhoria

### 1. Segurança (Crítico)
*   **Problema:** O `JWT_SECRET` tem um valor padrão (`'zela-secret-dev-key'`) no código. Se o `.env` não carregar em produção, qualquer um pode forjar tokens.
*   **Problema:** Tokens no `localStorage` são acessíveis via JavaScript (risco XSS).
*   **Problema:** Falta validação de dados de entrada (`req.body`) no backend. Um usuário pode enviar strings gigantes ou tipos errados.
*   **Melhoria:**
    *   Remover o fallback do `JWT_SECRET` e forçar erro se não existir.
    *   Adicionar validação com `Zod` no backend.
    *   Sanitizar inputs no frontend (embora React já proteja bem contra XSS básico).

### 2. Arquitetura Frontend (Urgente)
*   **Problema:** O arquivo `index.tsx` é gigante. Se você quiser mudar o design do "Card", terá que caçar em 2000 linhas.
*   **Melhoria:** Refatorar (Atomic Design ou por Funcionalidade):
    *   `/components/ui`: Button, Card, Badge, Input.
    *   `/components/features`: AdminPanel, SalesLanding, Dashboard, VaccineList.
    *   `/hooks`: `useAuth`, `useBabyData`.
    *   `/routes`: Separar o switch `view` em um Router real (React Router) ou manter simples mas em arquivo separado.

### 3. Backend e Banco de Dados
*   **Ponto Forte:** O uso de `pg` com queries parametrizadas (`$1`) previne SQL Injection.
*   **Melhoria:**
    *   Adicionar logs estruturados (não apenas `console.log`).
    *   Padronizar respostas de erro `{ error: string, code: string }`.

---

## 🚀 Plano de Ação para Profissionalização

Vou executar as melhorias em etapas para não quebrar o app:

### Fase 1: Segurança e Backend (Imediato)
1.  **Hardening do JWT:** Remover fallback inseguro e garantir tipagem do payload.
2.  **Validação de Input:** Criar middleware simples para validar campos obrigatórios no backend.
3.  **Refatorar Conexão DB:** Garantir que o pool de conexão lide bem com erros de conexão.

### Fase 2: Refatoração do Frontend (Maior Impacto)
1.  **Extrair Componentes UI:** Mover `Button`, `Card`, `Badge` para arquivos próprios em `components/ui`.
2.  **Extrair Funcionalidades:** Mover `AdminPanel`, `SalesLanding` (já movido, mas revisar), `Onboarding`, `Dashboard` para `components/views`.
3.  **Limpar `index.tsx`:** Deixar apenas o gerenciamento de estado global e roteamento.

### Fase 3: Qualidade de Código
1.  **Tipagem:** Remover `any` e usar as interfaces `UserData`, `BabyData` corretamente.
2.  **Linting:** Corrigir os erros de linter que apareceram nos logs anteriores.

Deseja que eu comece pela **Fase 1 (Segurança)** ou **Fase 2 (Organização do Frontend)**? (Recomendo Fase 2 pois o código está ficando incontrolável).
