# Zela App 👶

Aplicativo para acompanhamento do desenvolvimento de bebês, incluindo vacinas, desafios de desenvolvimento, rotinas e mais.

## 🚀 Stack

- **Frontend:** React 19 + TypeScript + Vite + TailwindCSS
- **Backend:** Express 5 + TypeScript
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT + bcrypt
- **State:** React Query

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (ou conta no Neon.tech)

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/pxttorrent/zela-app.git
cd zela-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

4. Execute as migrations:
```bash
npm run migrate
```

5. Inicie o projeto:
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev
```

## 🧪 Testes

```bash
npm test           # Watch mode
npm run test:run   # Single run
npm run test:coverage  # Com coverage
```

## 📁 Estrutura

```
zela-app/
├── components/        # Componentes React
│   ├── ui/           # Componentes base (Button, Card, etc)
│   ├── views/        # Páginas/Views
│   ├── layouts/      # Layouts (MainLayout, AdminLayout)
│   └── features/     # Componentes de features específicas
├── hooks/            # Custom hooks
├── server/           # Backend Express
│   ├── auth.ts       # Rotas de autenticação
│   ├── data.ts       # Rotas de dados
│   ├── admin.ts      # Rotas administrativas
│   └── middleware.ts # Middlewares
├── db/
│   ├── migrations/   # Migrations SQL
│   └── seeds/        # Seeds de dados
├── tests/            # Testes
├── types.ts          # Tipos TypeScript
├── api.ts            # Cliente API
└── utils.ts          # Funções utilitárias
```

## 🔐 Segurança

- Nunca commite o arquivo `.env`
- Use secrets fortes em produção
- Rotacione credenciais periodicamente

## 📄 Licença

MIT
