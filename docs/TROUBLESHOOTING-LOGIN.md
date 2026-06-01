# Login não funciona? Siga este guia

## Diagnóstico rápido (30 segundos)

No terminal, na pasta do projeto:

```powershell
cd C:\Users\leona\Projects\salao-beleza
npm run diagnostico
```

O script verifica banco, admin e senha automaticamente.

---

## Causas mais comuns

### 1. DATABASE_URL errada no `.env`

**Sintoma:** "E-mail ou senha incorretos" (mas a senha está certa)

**Causa:** O `.env` aponta para PostgreSQL inválido ou banco que não existe.

**Solução — desenvolvimento local:**

Abra o `.env` e deixe assim:

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="salao-beleza-dev-secret-altere-em-producao"
AUTH_URL="http://localhost:3000"
```

Depois rode:

```powershell
npm run db:seed
npm run dev
```

---

### 2. Usuário admin não existe no banco

**Sintoma:** Login falha mesmo com credenciais corretas

**Solução:**

```powershell
npm run db:seed
```

Contas criadas:

| E-mail | Senha |
|--------|-------|
| admin@salao.com | admin123 |
| maria@salao.com | staff123 |

---

### 3. Servidor desatualizado (Prisma em cache)

**Sintoma:** Erro no terminal ao logar, mencionando `findMany` ou `financialTransaction`

**Solução:**

```powershell
# Pare o servidor (Ctrl+C) e rode:
npx prisma generate
npm run dev
```

---

### 4. Dois servidores rodando ao mesmo tempo

**Sintoma:** Site abre na porta 3001 em vez de 3000, comportamento estranho

**Solução:**

```powershell
# Feche todos os terminais com npm run dev
# Ou mate o processo:
taskkill /F /IM node.exe
npm run dev
```

Acesse: **http://localhost:3000**

---

### 5. AUTH_SECRET faltando

**Sintoma:** Login parece funcionar mas redireciona de volta para `/login`

**Solução:** Adicione no `.env`:

```env
AUTH_SECRET="qualquer-string-longa-com-pelo-menos-32-caracteres"
```

Reinicie o servidor.

---

### 6. Produção (Vercel) — AUTH_URL errado

**Sintoma:** Funciona local, falha no site publicado

**Solução:** Na Vercel, configure:

```
AUTH_URL=https://sua-url.vercel.app
```

Sem barra no final. Depois faça **Redeploy**.

---

## Sequência completa para resetar tudo

Se nada funcionar, rode na ordem:

```powershell
cd C:\Users\leona\Projects\salao-beleza

# 1. Corrigir .env
Copy-Item .env.example .env -Force

# 2. Regenerar banco
npx prisma generate
npx prisma migrate deploy

# 3. Criar usuários demo
npm run db:seed

# 4. Verificar
npm run diagnostico

# 5. Iniciar
npm run dev
```

Login: **admin@salao.com** / **admin123**

---

## Ainda com problema?

Rode `npm run diagnostico` e envie o resultado — ele mostra exatamente onde está o erro.
