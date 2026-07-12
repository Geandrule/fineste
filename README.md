# FinEstet — Sistema de Gestão para Clínicas

Sistema SaaS completo para gestão financeira e clínica de enfermeiras estetas.

## Stack
- **Next.js 14** (App Router + Server Components)
- **PostgreSQL** + **Prisma ORM**
- **JWT** para autenticação (cookie httpOnly)
- **Docker** para deploy no EasyPanel (Hostinger VPS)

---

## 🚀 Deploy no Hostinger VPS (EasyPanel)

### 1. Preparar o repositório
```bash
git init
git add .
git commit -m "feat: sistema finestai v1"
git remote add origin https://github.com/SEU_USUARIO/finestai.git
git push -u origin main
```

### 2. No EasyPanel
1. Acesse seu EasyPanel → **Create Service** → **App**
2. Conecte ao repositório GitHub
3. Tipo: **Dockerfile**
4. Porta: `3000`

### 3. Variáveis de ambiente (no EasyPanel)
```
DATABASE_URL=postgresql://finestai:SENHA@postgres:5432/finestai_db
JWT_SECRET=STRING_ALEATORIA_FORTE_MINIMO_32_CHARS
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://app.finestai.com.br
```

### 4. Banco de dados
No EasyPanel → **Create Service** → **PostgreSQL**
- Database: `finestai_db`
- User: `finestai`
- Anote a senha gerada e coloque no `DATABASE_URL`

### 5. Migrations + Seed
Após o primeiro deploy, no terminal do EasyPanel:
```bash
npx prisma migrate deploy
node prisma/seed.js
```

### 6. Domínio
EasyPanel → seu app → **Domains** → adicionar `app.finestai.com.br`
SSL automático via Let's Encrypt ✅

---

## 🔐 Primeiro acesso
Após o seed:
- **Email:** `paloma@finestai.com.br`
- **Senha:** `Paloma@2026`

> Troque a senha no primeiro acesso!

---

## 📁 Estrutura
```
src/
  app/
    (auth)/login/         # Tela de login
    (dashboard)/          # Layout autenticado
      dashboard/          # KPIs e últimos lançamentos
      lancamentos/        # Lançamentos financeiros (CRUD)
      pacientes/          # Cadastro de pacientes
      pacientes/[id]/     # Perfil e histórico do paciente
      dre/                # Demonstração de Resultado
      evolucoes/          # Evoluções clínicas
      termos/             # Termos TCLE
    api/
      auth/login/         # POST — autenticar
      auth/logout/        # POST — sair
      auth/me/            # GET — sessão atual
      lancamentos/        # GET + POST
      pacientes/          # GET + POST
      evolucoes/          # GET + POST
      dre/                # GET — DRE calculada
  components/
    layout/Sidebar.tsx    # Menu lateral
  lib/
    prisma.ts             # Cliente do banco
    auth.ts               # JWT + bcrypt
    utils.ts              # Formatadores
  hooks/
    useAuth.ts            # Hook de sessão
    useAPI.ts             # Fetch genérico
  middleware.ts           # Proteção de rotas
prisma/
  schema.prisma           # Schema do banco (6 tabelas)
  seed.js                 # Dados iniciais
```

---

## 📋 Roadmap
- [x] Autenticação JWT (login/logout)
- [x] Multi-tenant (clínicas isoladas)
- [x] Lançamentos financeiros
- [x] DRE automática
- [x] Cadastro de pacientes
- [x] Perfil de paciente com histórico
- [ ] Evolução de pacientes (formulário completo)
- [ ] Termos TCLE + PDF
- [ ] Configurações da clínica
- [ ] Planos + cobrança (Stripe)
- [ ] App mobile (React Native)
- [ ] Relatórios avançados
- [ ] Integração WhatsApp para notificações
