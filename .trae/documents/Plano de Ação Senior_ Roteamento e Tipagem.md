# Plano de Evolução Técnica: Zela App v2.0

Com base na avaliação "Senior Full Stack", identificamos que o projeto está seguro e organizado, mas falha em **Navegabilidade** e **Tipagem Estrita**. Este plano visa resolver essas dívidas técnicas.

## Fase 1: Navegação Profissional (Prioridade Máxima)
O sistema atual de navegação por estado (`setView`) quebra o botão "voltar" do navegador e impede links diretos.
1.  **Instalar React Router DOM:** `npm install react-router-dom`
2.  **Configurar Router:** Criar `components/AppRouter.tsx` para definir as rotas (`/login`, `/dashboard`, `/profile`).
3.  **Refatorar Layouts:** Adaptar `MainLayout` e `AdminLayout` para usar `<Outlet />` e `<Link />` ao invés de botões `onClick`.
4.  **Atualizar Index:** Substituir a lógica de `view` manual pelo `RouterProvider`.

## Fase 2: Cruzada contra o `any` (Qualidade)
O uso de `any` em arquivos centrais (`useDashboardData`, `MainLayout`) compromete a segurança do código.
1.  **Auditoria de Tipos:** Criar interfaces estritas para `User`, `Baby`, `TrackerLog` (já iniciada, mas precisa ser aplicada).
2.  **Refatoração de Hooks:** Tipar corretamente os retornos de `useDashboardData` e `useAuth`.
3.  **Refatoração de Componentes:** Garantir que props de componentes como `StatusCards` e `QuickTrackers` não aceitem `any`.

## Fase 3: Gerenciamento de Estado Moderno (Opcional/Futuro)
Substituir `useEffect` + `fetch` por **TanStack Query** para ganhar cache, retries automáticos e estados de `isLoading`/`isError` nativos.

---

### Benefícios Esperados
*   **UX:** O usuário poderá usar o botão "Voltar" do celular naturalmente.
*   **DX (Dev Experience):** O TypeScript vai avisar sobre erros reais ao invés de ignorá-los com `any`.
*   **Escalabilidade:** Rotas permitem Code Splitting (carregar apenas o necessário).