# Deploy gratuito — StudioFlow online

Coloque seu projeto na internet **de graça** para qualquer pessoa acessar e testar.

**Stack de deploy:** [Neon](https://neon.tech) (banco PostgreSQL grátis) + [Vercel](https://vercel.com) (hospedagem Next.js grátis)

Tempo estimado: **15 minutos**

---

## Visão geral

```
Usuários → https://studioflow.vercel.app → Vercel (Next.js)
                                              ↓
                                    Neon (PostgreSQL grátis)
```

---

## Passo 1 — Criar banco de dados no Neon (5 min)

1. Acesse **[neon.tech](https://neon.tech)** e crie conta (GitHub login funciona)
2. Clique em **New Project**
3. Nome: `studioflow`
4. Região: escolha a mais próxima (ex: `US East` ou `São Paulo` se disponível)
5. Clique em **Create Project**
6. Na tela do projeto, copie a **Connection string** (formato):
   ```
   postgresql://usuario:senha@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```

> Guarde essa URL — você vai usar no `.env` local e na Vercel.

---

## Passo 2 — Configurar localmente e popular o banco (5 min)

No terminal, na pasta do projeto:

```powershell
cd C:\Users\leona\Projects\salao-beleza
```

Edite o arquivo `.env` (copie de `.env.example` se não existir):

```env
DATABASE_URL="postgresql://...sua-url-do-neon...?sslmode=require"
AUTH_SECRET="qualquer-string-longa-e-aleatoria-minimo-32-chars"
AUTH_URL="http://localhost:3000"
```

Gere um AUTH_SECRET seguro (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Rode migrations e seed:

```powershell
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

Teste localmente:

```powershell
npm run dev
```

Login demo: `admin@salao.com` / `admin123`

---

## Passo 3 — Subir código no GitHub (se ainda não fez)

```powershell
git add .
git commit -m "chore: prepara deploy com Neon e Vercel"
git push -u origin main
```

Repositório: https://github.com/leonarddoarruda/studioflow

---

## Passo 4 — Deploy na Vercel (5 min)

1. Acesse **[vercel.com](https://vercel.com)** → Login com GitHub
2. Clique em **Add New → Project**
3. Importe o repositório `leonarddoarruda/studioflow`
4. Em **Environment Variables**, adicione:

| Nome | Valor |
|------|-------|
| `DATABASE_URL` | Sua connection string do Neon (com `?sslmode=require`) |
| `AUTH_SECRET` | O mesmo secret que você usou no `.env` local |
| `AUTH_URL` | Deixe vazio por enquanto — atualize após o deploy |

5. Clique em **Deploy** e aguarde (~2 min)

6. Quando terminar, copie a URL gerada (ex: `https://studioflow-xxx.vercel.app`)

7. Volte em **Settings → Environment Variables** e atualize:
   - `AUTH_URL` = `https://studioflow-xxx.vercel.app` (sua URL real)

8. Vá em **Deployments → ... → Redeploy** para aplicar o AUTH_URL

---

## Passo 5 — Compartilhar

Sua URL pública ficará assim:

```
https://studioflow-xxx.vercel.app
```

**Contas demo para visitantes testarem:**

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@salao.com | admin123 |
| Profissional | maria@salao.com | staff123 |
| Cliente | Cadastre em `/register` | — |

Cole a URL no LinkedIn, currículo e GitHub README.

---

## Domínio personalizado (opcional)

Na Vercel → Settings → Domains → adicione um domínio seu (ex: `studioflow.seudominio.com`).

---

## WhatsApp em produção (opcional)

Para ativar notificações WhatsApp no ar, adicione na Vercel:

| Variável | Descrição |
|----------|-----------|
| `EVOLUTION_API_URL` | URL da sua Evolution API |
| `EVOLUTION_API_KEY` | Chave da API |
| `EVOLUTION_INSTANCE_NAME` | Nome da instância |

Sem isso, o sistema funciona normalmente — mensagens aparecem no log.

---

## Problemas comuns

### "DATABASE_URL não configurada"
→ Adicione a variável na Vercel e faça redeploy.

### Login não funciona após deploy
→ Verifique se `AUTH_URL` na Vercel é exatamente a URL do site (com `https://`, sem barra no final).

### Erro de SSL no banco
→ Confirme que a URL do Neon termina com `?sslmode=require`.

### Banco vazio após deploy
→ Rode o seed localmente apontando para o Neon:
```powershell
npm run db:seed
```
(O seed usa o `DATABASE_URL` do seu `.env` — o mesmo banco que a Vercel usa)

---

## Limites do plano grátis

| Serviço | Limite grátis |
|---------|---------------|
| **Neon** | 512 MB, 1 projeto, sempre online |
| **Vercel** | 100 GB bandwidth/mês, deploy ilimitado |

Suficiente para portfólio e demonstrações.

---

## Atualizar o site após mudanças no código

```powershell
git add .
git commit -m "sua mensagem"
git push
```

A Vercel faz redeploy automaticamente a cada push no GitHub.
