# 🔐 Login API

> **EN:** Secure authentication REST API built with Fastify, PostgreSQL and JWT.  
> **PT:** API REST de autenticação segura construída com Fastify, PostgreSQL e JWT.

---

## 🌐 Overview | Visão Geral

**EN:**  
A production-ready authentication API focused on security best practices. Built as a learning project to understand how real-world login systems work under the hood — and how to defend them against common attacks.

**PT:**  
Uma API de autenticação focada em boas práticas de segurança. Construída como projeto de aprendizado para entender como sistemas de login funcionam na prática — e como defendê-los contra ataques comuns.

---

## 🛡️ Security Features | Funcionalidades de Segurança

| Feature | Description (EN) | Descrição (PT) |
|---|---|---|
| **bcrypt** | Passwords are hashed with 12 salt rounds — never stored as plain text | Senhas são hasheadas com 12 salt rounds — nunca armazenadas em texto puro |
| **JWT + Blacklist** | Tokens are invalidated on logout via a JTI blacklist in the database | Tokens são invalidados no logout via blacklist de JTI no banco de dados |
| **Rate Limiting** | Login and register endpoints are limited to 5 requests/minute per IP | Endpoints de login e registro limitados a 5 requisições/minuto por IP |
| **User Enumeration Prevention** | Login always returns the same error regardless of what failed | Login sempre retorna o mesmo erro independente do que falhou |
| **SQL Injection Protection** | All queries use parameterized statements (`$1`, `$2`) | Todas as queries usam declarações parametrizadas (`$1`, `$2`) |
| **Environment Variables** | Secrets are stored in `.env` and never committed to the repository | Segredos ficam no `.env` e nunca são commitados no repositório |

---

## 🗂️ Project Structure | Estrutura do Projeto

```
login-api/
├── src/
│   ├── routes/
│   │   └── auth.js           # Endpoints definitions | Definição dos endpoints
│   ├── controllers/
│   │   └── authController.js # Input validation + response | Validação de input + resposta
│   ├── services/
│   │   └── authService.js    # Business logic (bcrypt, JWT) | Regras de negócio
│   ├── middleware/
│   │   └── rateLimiter.js    # Rate limit config | Configuração de rate limit
│   ├── models/
│   │   └── userModel.js      # Database queries | Queries no banco
│   ├── app.js                # Fastify setup + plugins | Configuração do Fastify
│   └── server.js             # Server entry point | Ponto de entrada do servidor
├── .env.example              # Environment variables template | Template de variáveis
└── package.json
```

---

## 🚀 Getting Started | Como Rodar

### Prerequisites | Pré-requisitos

- Node.js 18+
- PostgreSQL 13+

### Installation | Instalação

```bash
# Clone the repository | Clone o repositório
git clone https://github.com/gbzero777/login-api.git
cd login-api

# Install dependencies | Instale as dependências
npm install

# Copy environment variables | Copie as variáveis de ambiente
cp .env.example .env
```

### Environment Variables | Variáveis de Ambiente

**EN:** Open `.env` and fill in your values:  
**PT:** Abra o `.env` e preencha com seus valores:

```env
JWT_SECRET=your_long_random_secret_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=login_api
DB_USER=postgres
DB_PASSWORD=your_db_password
PORT=3000
```

### Database Setup | Configuração do Banco

```bash
# Create the database | Crie o banco de dados
psql -U postgres -c "CREATE DATABASE login_api;"

# The tables are created automatically on first run
# As tabelas são criadas automaticamente na primeira execução
```

### Run | Executar

```bash
# Development | Desenvolvimento
npm run dev

# Production | Produção
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description (EN) | Descrição (PT) |
|---|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Create a new user | Cria um novo usuário |
| `POST` | `/auth/login` | ❌ | Authenticate and receive JWT | Autentica e recebe JWT |
| `GET` | `/auth/me` | ✅ | Returns authenticated user data | Retorna dados do usuário autenticado |
| `POST` | `/auth/logout` | ✅ | Revokes the current token | Revoga o token atual |

### Examples | Exemplos

**Register | Registro**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123!"}'
```

**Login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123!"}'
```

**Protected route | Rota protegida**
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Logout**
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧰 Tech Stack

- **[Fastify](https://fastify.dev/)** — Fast and low overhead web framework
- **[PostgreSQL](https://www.postgresql.org/)** — Relational database
- **[JWT (@fastify/jwt)](https://github.com/fastify/fastify-jwt)** — JSON Web Token authentication
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — Password hashing
- **[@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit)** — Rate limiting plugin

---

## 👤 Author | Autor

**GabrielSecDev** — [@gbzero777](https://github.com/Gabriel-SecDev)  
Bug Bounty Researcher | Web Security | ADS Student

---

## 📄 License

MIT
