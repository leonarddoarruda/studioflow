# StudioFlow

> Sistema fullstack de gestão para salões de beleza — projeto pessoal desenvolvido por **Leonardo**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Sobre o projeto

O **StudioFlow** é um sistema web completo que desenvolvi do zero para centralizar a operação de um salão de beleza: agendamentos, fluxo de caixa, estoque, equipe e notificações WhatsApp — tudo em uma única plataforma.

Projeto ideal para **portfólio fullstack**, demonstrando capacidade de construir produto real do frontend ao banco de dados.

### O que este projeto demonstra

- Arquitetura **fullstack** com Next.js App Router
- **API REST** com validação (Zod) e autenticação (NextAuth)
- Modelagem de banco relacional com **Prisma ORM**
- Controle de acesso por **perfis** (Admin, Profissional, Cliente)
- Integração externa (**WhatsApp** via Evolution API)
- UI responsiva e consistente com **Tailwind CSS**

### Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| **Agendamentos** | Clientes agendam online; confirmação automática via WhatsApp |
| **Fluxo de Caixa** | Receitas, despesas, saldo mensal e gráfico dos últimos 6 meses |
| **Estoque** | Produtos, movimentações e alertas de estoque baixo |
| **Equipe** | Gestão de administradores e profissionais |
| **Serviços** | Catálogo com preços, duração e status |
| **WhatsApp** | Notificações para cliente e salão via Evolution API |

---

## Screenshots

| Landing | Dashboard | Financeiro |
|---------|-------------|------------|
| *adicione em `docs/screenshots/`* | | |

---

## Stack tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Banco de dados | SQLite + Prisma ORM 7 |
| Autenticação | NextAuth.js v5 |
| Validação | Zod |
| Integrações | Evolution API (WhatsApp) |

---

## Como rodar localmente

**Pré-requisito:** Node.js 20+

```bash
git clone https://github.com/leonarddoarruda/studioflow.git
cd studioflow
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Acesse **http://localhost:3000**

### Contas de demonstração

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Administrador | admin@salao.com | admin123 |
| Profissional | maria@salao.com | staff123 |
| Cliente | Cadastre em `/register` | — |

---

## Estrutura do projeto

```
src/
├── app/
│   ├── api/                 # Endpoints REST
│   └── dashboard/           # Painel autenticado
│       ├── financeiro/      # Fluxo de caixa
│       ├── agendamentos/
│       └── ...
├── components/              # UI reutilizável
└── lib/
    ├── auth.ts              # Autenticação
    ├── finance.ts           # Regras financeiras
    └── whatsapp/            # Integração WhatsApp
```

---

## Deploy gratuito (colocar online)

Guia completo em **[docs/DEPLOY.md](docs/DEPLOY.md)** — Neon (banco grátis) + Vercel (hospedagem grátis).

Resumo: crie banco no [Neon](https://neon.tech) → configure `.env` → `npm run db:seed` → importe no [Vercel](https://vercel.com).

---

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:seed` | Dados de demonstração |
| `npm run db:studio` | Visualizador do banco |

---

## Autor

**Leonardo** — Desenvolvedor Fullstack

- GitHub: [@leonarddoarruda](https://github.com/leonarddoarruda)
- LinkedIn: [/in/leonarddoarruda](https://linkedin.com/in/leonarddoarruda)

> Atualize o link do LinkedIn em `src/lib/brand.ts` se o seu perfil usar outro slug.

---

## Licença

MIT — veja [LICENSE](LICENSE)
