# 💡 Plataforma de Ideias - MVP

Plataforma colaborativa para o Instituto J&F Tech onde colaboradores podem **compartilhar ideias**, **votar** em propostas e **acompanhar** a inovação da instituição.

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Diagramas](#diagramas)
- [API Endpoints](#api-endpoints)
- [Segurança](#segurança)

## 🎯 Visão Geral

A **Plataforma de Ideias** é uma aplicação web que permite que colaboradores do Instituto J&F Tech:

✅ **Cadastrem e gerenciem ideias inovadoras**
✅ **Votem em ideias** (um voto por usuário por ideia)
✅ **Visualizem ideias ordenadas por popularidade (votos)**
✅ **Acompanhem seu perfil e ideias criadas**
✅ **Gerenciem categorias de ideias**

### Características de Segurança
🔐 Autenticação com hash de senha (bcrypt)
🔐 Gerenciamento de sessão com express-session
🔐 Proteção CSRF com csurf
🔐 Headers HTTP protegidos com helmet
🔐 Validação em duas camadas (client-side + server-side)

## ✨ Funcionalidades

### 1. Autenticação
- ✅ Registro de novos usuários com validação de email e CPF
- ✅ Login seguro com senha criptografada
- ✅ Gerenciamento de sessão
- ✅ Logout com limpeza de sessão

### 2. CRUD de Ideias
- ✅ **Create**: Criar novas ideias com título, descrição e categoria
- ✅ **Read**: Listar todas as ideias (ordenadas por votos)
- ✅ **Read**: Visualizar detalhes de uma ideia específica
- ✅ **Update**: Editar ideias (apenas autor)
- ✅ **Delete**: Remover ideias (apenas autor)

### 3. Sistema de Votação
- ✅ Votar em ideias (um voto por usuário por ideia)
- ✅ Remover voto de uma ideia
- ✅ Contagem automática de votos
- ✅ Integridade de voto única no banco de dados

### 4. Perfil de Usuário
- ✅ Visualizar informações pessoais
- ✅ Listar ideias criadas pelo usuário
- ✅ Estatísticas de ideias

## 🛠️ Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| **Runtime** | Node.js | v22.x |
| **Framework Web** | Express.js | 5.1.0 |
| **Banco de Dados** | PostgreSQL | 12+ |
| **ORM** | Sequelize | 6.37.7 |
| **Template Engine** | Express-Handlebars | 8.0.3 |
| **Autenticação** | bcryptjs | 3.0.3 |
| **Sessão** | express-session | 1.18.2 |
| **Segurança** | helmet | 7.1.0 |
| **CSRF** | csurf | 1.11.0 |
| **Validação** | express-validator | 7.0.0 |
| **Flash Messages** | connect-flash | 0.1.1 |
| **Variáveis de Ambiente** | dotenv | 17.2.3 |
| **Dev Tools** | nodemon | 3.1.10 |

## 📦 Instalação

### Pré-requisitos
- Node.js v14+ instalado
- PostgreSQL v12+ instalado e rodando
- Git

### Passos

#### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/geovannad/project-plataform-ideia-async.git
cd project-plataform-ideia-async
```

#### 2️⃣ Instalar dependências
```bash
npm install --legacy-peer-deps
```

#### 3️⃣ Configurar variáveis de ambiente
Criar arquivo `.env` na raiz do projeto:

```env
# Database Configuration
DB_NAME=ideia_platform
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_HOST=localhost
DB_PORT=5432
DB_SSL_CA=

# Session Configuration
SESSION_SECRET=sua_chave_secreta_super_forte_aqui

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### 4️⃣ Criar banco de dados PostgreSQL
```bash
createdb ideia_platform
```

#### 5️⃣ Iniciar o servidor
```bash
npm start
```

O servidor iniciará em `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente
```env
# Database
DB_NAME          # Nome do banco de dados PostgreSQL
DB_USER          # Usuário do PostgreSQL
DB_PASSWORD      # Senha do PostgreSQL
DB_HOST          # Host do servidor PostgreSQL
DB_PORT          # Porta do PostgreSQL (padrão: 5432)
DB_SSL_CA        # Certificado SSL (se necessário)

# Session
SESSION_SECRET   # Chave secreta para criptografar sessões (use string aleatória forte)

# Server
PORT             # Porta do servidor (padrão: 3000)
NODE_ENV         # Ambiente (development/production)
```

## 🚀 Como Usar

### Fluxo de Uso

#### 1. Cadastro
1. Acesse `http://localhost:3000/register`
2. Preencha: Nome, Email, CPF e Senha
3. Clique em "Registrar"

#### 2. Login
1. Acesse `http://localhost:3000/login`
2. Preencha: Email e Senha
3. Clique em "Entrar"

#### 3. Criar Ideia
1. Clique em "Nova Ideia" na navbar
2. Preencha: Título, Descrição e Categoria
3. Clique em "Criar Ideia"

#### 4. Votar em Ideias
1. Na home, veja todas as ideias ordenadas por votos
2. Clique em "Ver Detalhes" para uma ideia
3. Clique em "Votar Nessa Ideia" para adicionar seu voto
4. Clique em "Remover Meu Voto" para remover

#### 5. Gerenciar Ideias
1. Acesse seu perfil clicando no seu nome na navbar
2. Edite ou delete suas ideias

## 📂 Estrutura do Projeto

```
project-plataform-ideia-async/
├── models/                    # Modelos Sequelize
│   ├── User.js               # Modelo de usuário
│   ├── Idea.js               # Modelo de ideia
│   ├── Category.js           # Modelo de categoria
│   ├── Vote.js               # Modelo de votação
│   ├── Response.js           # Respostas/comentários
│   ├── Address.js            # Endereços
│   └── index.js              # Conexão Sequelize
│
├── controller/               # Controllers/Lógica de Negócio
│   ├── IdeaController.js     # Gerenciamento de ideias
│   ├── VoteController.js     # Sistema de votação
│   ├── UserController.js     # Gerenciamento de usuários
│   └── CategoryController.js # Gerenciamento de categorias
│
├── routes/                   # Definição de rotas
│   ├── IdeaRoutes.js         # Rotas de ideias
│   ├── UserRoutes.js         # Rotas de usuários
│   ├── CategoryRoutes.js     # Rotas de categorias
│   └── authRoutes.js         # Rotas de autenticação
│
├── middlewares/              # Middlewares customizados
│   ├── isLoggedIn.js         # Verifica autenticação
│   └── isAuthor.js           # Verifica se é autor
│
├── views/                    # Templates Handlebars
│   ├── layouts/
│   │   ├── main.handlebars   # Layout principal
│   │   └── authLayout.handlebars
│   ├── auth/
│   │   ├── login.handlebars
│   │   └── register.handlebars
│   ├── ideas/
│   │   ├── create.handlebars
│   │   ├── edit.handlebars
│   │   └── show.handlebars
│   ├── home.handlebars       # Página inicial
│   ├── profile.handlebars    # Perfil do usuário
│   └── error.handlebars      # Página de erro
│
├── public/                   # Arquivos estáticos
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── modal.js
│   └── images/
│
├── db/                       # Configuração do banco
│   └── conn.js              # Conexão Sequelize
│
├── .env                      # Variáveis de ambiente
├── index.js                  # Arquivo principal
├── package.json              # Dependências
└── README.md                 # Este arquivo
```

## 📊 Diagramas

### Diagrama de Entidade-Relacionamento (ER)

<img width="904" height="601" alt="image" src="https://github.com/user-attachments/assets/4e823dbc-9152-4b9c-a5d5-f3df1a2aaf07" />

**Tabelas do Banco:**
1. **Category**: Armazena categorias de ideias
2. **User**: Armazena dados de usuários (CPF e Email únicos)
3. **Ideia**: Armazena ideias com referência ao autor (User) e categoria (Category)
4. **Response**: Armazena votações de usuários em ideias (equivalente a Vote/Voto)

### Fluxo de Autenticação
```
[Usuário]
    │
    ├─→ GET /login → [Exibe formulário]
    │
    ├─→ POST /login → [Valida credenciais]
    │       ├─→ Senha incorreta? → [Flash error + /login]
    │       └─→ Sucesso → [Cria sessão + /home]
    │
    └─→ GET /logout → [Destroy session + /login]
```

### Fluxo de Votação
```
[Usuário Logado] → GET /ideas/:id
    │
    ├─→ Usuário É Autor?
    │   └─→ SIM: [Mostra opções de editar/deletar]
    │   └─→ NÃO: 
    │       ├─→ Já votou?
    │       │   └─→ SIM: [Mostra "Remover Voto"]
    │       │   └─→ NÃO: [Mostra "Votar"]
    │
    ├─→ POST /ideas/:ideaId/vote
    │   └─→ [Cria Vote (id_user, id_idea)]
    │   └─→ [Integridade: UNIQUE(id_user, id_idea)]
    │
    └─→ POST /ideas/:ideaId/unvote
        └─→ [Deleta Vote]
```

## 🔌 API Endpoints

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/login` | Exibe formulário de login |
| POST | `/login` | Autentica usuário |
| GET | `/register` | Exibe formulário de registro |
| POST | `/register` | Registra novo usuário |
| GET | `/logout` | Faz logout |

### Ideias
| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/` | Lista todas as ideias | Não |
| GET | `/ideas/create` | Formulário criar ideia | Sim |
| POST | `/ideas` | Cria nova ideia | Sim |
| GET | `/ideas/:id` | Detalhes da ideia | Não |
| GET | `/ideas/:id/edit` | Formulário editar ideia | Sim + Autor |
| POST | `/ideas/:id` | Atualiza ideia | Sim + Autor |
| POST | `/ideas/:id/delete` | Deleta ideia | Sim + Autor |

### Votação
| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/ideas/:ideaId/vote` | Votar em ideia | Sim |
| POST | `/ideas/:ideaId/unvote` | Remover voto | Sim |

### Perfil
| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | `/profile` | Perfil do usuário logado | Sim |

### API REST Legada
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/idea` | Lista ideias (JSON) |
| GET | `/api/v1/idea/:id` | Detalhes ideia (JSON) |
| POST | `/api/v1/idea` | Cria ideia (JSON) |
| PUT | `/api/v1/idea/:id` | Atualiza ideia (JSON) |
| DELETE | `/api/v1/idea/:id` | Deleta ideia (JSON) |

## 🔐 Segurança

### Implementações de Segurança

#### 1. **Criptografia de Senha**
```javascript
// Registro
const hashedPassword = await bcrypt.hash(password, 10);
await User.create({ password: hashedPassword });

// Login
const match = await bcrypt.compare(password, user.password);
```

#### 2. **Proteção CSRF**
```javascript
// Middleware CSRF
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

// Em formulários
<input type="hidden" name="_csrf" value="{{csrfToken}}">
```

#### 3. **Headers de Segurança (Helmet)**
```javascript
app.use(helmet()); // Adiciona headers de segurança
```

#### 4. **Validação em Duas Camadas**

**Client-side**: HTML5 validation + JavaScript

**Server-side**: express-validator
```javascript
body("title", "Título é obrigatório").trim().notEmpty().isLength({ min: 3 })
body("email", "Email inválido").isEmail()
```

#### 5. **Autorização com Middlewares**
```javascript
// isLoggedIn: Verifica se usuário está autenticado
// isAuthor: Verifica se é autor da ideia
```

#### 6. **Variáveis de Ambiente**
- Credenciais do banco em `.env`
- SESSION_SECRET protegido
- Nunca commit no Git

### Checklist de Segurança ✅
- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ Proteção CSRF em todos os formulários POST
- ✅ Headers HTTP protegidos com helmet
- ✅ Validação de entrada em duas camadas
- ✅ Autorização por middleware (isAuthor)
- ✅ Sessões seguras com express-session
- ✅ Variáveis de ambiente não versionadas
- ✅ SQL Injection prevenido pelo Sequelize

## 📝 Comandos Úteis

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Iniciar servidor (com nodemon)
npm start

# Criar banco de dados PostgreSQL
createdb ideia_platform

# Acessar banco PostgreSQL
psql -U seu_usuario -d ideia_platform

# Ver logs do servidor
npm start -- --inspect
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se PostgreSQL está rodando
- Confirme credenciais no `.env`
- Verifique se o banco `ideia_platform` existe

### Erro: "Self-signed certificate in certificate chain"
- Se usar PostgreSQL em cloud com SSL:
  - Defina `rejectUnauthorized: false` em `models/index.js`
  - Ou adicione certificado no `.env` (DB_SSL_CA)

### Erro: "Port 3000 is already in use"
- Mude a PORT no `.env` ou feche o processo anterior
- Linux/Mac: `lsof -i :3000` e `kill -9 PID`
- Windows: `netstat -ano | findstr :3000`

## 🤝 Contribuindo

Siga os padrões de código:
1. Use async/await para operações assíncronas
2. Trate erros com try/catch
3. Valide dados em controllers
4. Use middlewares para lógica compartilhada
5. Comente código complexo

## 📄 Licença

ISC

## 👨‍💻 Desenvolvido por

**Instituto J&F Tech** - Plataforma de Ideias MVP

**Equipe:** Geovanna, [Seu Nome], [Outro Membro]

---

**Última atualização:** Novembro 2024

**Status:** ✅ MVP Funcional - Pronto para produção

