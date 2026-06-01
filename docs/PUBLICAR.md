# Guia de publicação — GitHub & LinkedIn

Siga estes passos na ordem. Leva cerca de 20 minutos.

---

## Parte 1 — Preparar seus dados (5 min)

Edite `src/lib/brand.ts` com suas informações reais:

```typescript
author: {
  name: "Leonardo",           // seu nome completo
  role: "Desenvolvedor Fullstack",
  github: "https://github.com/leonarddoarruda",
  linkedin: "https://linkedin.com/in/leonarddoarruda",
  email: "seu@email.com",
},
```

No `README.md`, substitua todas as ocorrências de `SEU-USUARIO` pelo seu usuário do GitHub.

---

## Parte 2 — Tirar screenshots (5 min)

Com o sistema rodando (`npm run dev`), capture estas telas e salve em `docs/screenshots/`:

1. **landing.png** — Página inicial (http://localhost:3000)
2. **dashboard.png** — Painel admin após login
3. **financeiro.png** — Fluxo de caixa
4. **agendamentos.png** — Lista de agendamentos

**Windows:** `Win + Shift + S` para capturar área da tela.

Depois, adicione as imagens no README (opcional):

```markdown
![Dashboard](docs/screenshots/dashboard.png)
```

---

## Parte 3 — Subir para o GitHub (10 min)

### 3.1 Criar repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Preencha:
   - **Repository name:** `studioflow` (ou `salao-beleza`)
   - **Description:** `Sistema fullstack de gestão para salões de beleza — Next.js, TypeScript, Prisma`
   - **Public** ✓
   - **NÃO** marque "Add a README" (já temos um)
3. Clique em **Create repository**

### 3.2 Enviar o código (terminal do VS Code)

```powershell
cd C:\Users\leona\Projects\salao-beleza

# Renomear branch para main (padrão do GitHub)
git branch -M main

# Conectar ao seu repositório (troque SEU-USUARIO e studioflow)
git remote add origin https://github.com/leonarddoarruda/studioflow.git

# Enviar
git push -u origin main
```

Se pedir login, use seu **Personal Access Token** do GitHub (Settings → Developer settings → Personal access tokens).

### 3.3 Configurar o repositório (importante para recrutadores)

No GitHub, vá em **Settings** do repositório:

- **About** (lado direito da página do repo):
  - Description: `Sistema fullstack para salões de beleza — agendamentos, financeiro, estoque e WhatsApp`
  - Website: (opcional, se fizer deploy)
  - Topics: `nextjs`, `typescript`, `prisma`, `fullstack`, `portfolio`, `tailwindcss`, `nextauth`

- **Social preview:** Settings → General → Social preview → faça upload de uma screenshot

---

## Parte 4 — LinkedIn (10 min)

### 4.1 Adicionar ao perfil

1. LinkedIn → **Perfil** → **Em destaque** → **Adicionar**
2. Escolha **Link** ou **Projeto**
3. Título: `StudioFlow — Sistema de Gestão para Salões`
4. URL: link do seu GitHub
5. Descrição: use o texto abaixo (versão curta)

### 4.2 Post para publicar (copie e cole)

```
🚀 Projeto de portfólio — StudioFlow

Desenvolvi do zero um sistema fullstack para gestão de salões de beleza.

O que o sistema faz:
✅ Agendamentos online com confirmação via WhatsApp
✅ Fluxo de caixa (receitas, despesas e saldo mensal)
✅ Controle de estoque com alertas
✅ Gestão de equipe e catálogo de serviços
✅ Três perfis de acesso: Admin, Profissional e Cliente

🛠 Stack: Next.js 16 · TypeScript · Prisma · NextAuth · Tailwind CSS · SQLite

Foi um projeto completo — do modelagem do banco à interface, passando por autenticação, API REST e integração com WhatsApp (Evolution API).

📂 Código aberto no GitHub: https://github.com/leonarddoarruda/studioflow

#desenvolvedor #fullstack #nextjs #typescript #portfolio #webdevelopment #programacao #tech #software
```

### 4.3 Dicas para chamar atenção de recrutadores

| Dica | Por quê |
|------|---------|
| Publique com **1–4 screenshots** no post | Recrutadores julgam visualmente em 3 segundos |
| Fixe o post no topo do perfil por 2 semanas | Aumenta visibilidade |
| Adicione o projeto em **Projetos** do LinkedIn | Aparece na seção de experiência técnica |
| Peça 2–3 conexões para **curtir/comentar** nas primeiras horas | Algoritmo impulsiona posts com engajamento inicial |
| Comente em posts de tech com link discreto | "Recentemente publiquei um projeto similar..." |

### 4.4 Versão curta para bio / mensagem a recrutador

> Desenvolvi o StudioFlow, um sistema fullstack (Next.js + TypeScript + Prisma) com agendamentos, fluxo de caixa, estoque e WhatsApp. Código: [link GitHub]

---

## Parte 5 — Deploy opcional (bonus no currículo)

Deploy gratuito na [Vercel](https://vercel.com):

1. Conecte sua conta GitHub na Vercel
2. Importe o repositório `studioflow`
3. Adicione variáveis de ambiente do `.env.example`
4. Deploy → cole a URL no LinkedIn e no README

---

## Checklist final

- [ ] `src/lib/brand.ts` com seus links reais
- [ ] `README.md` com SEU-USUARIO substituído
- [ ] Screenshots em `docs/screenshots/`
- [ ] Repositório público no GitHub
- [ ] Topics configurados no GitHub
- [ ] Post publicado no LinkedIn
- [ ] Projeto adicionado em "Em destaque" do LinkedIn
