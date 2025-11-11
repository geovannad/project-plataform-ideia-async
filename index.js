require("dotenv").config();

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const helmet = require("helmet");
const csrf = require("csurf");
const { body, validationResult } = require("express-validator");

// Importando modelos
const db = require("./models");
const { User, Idea, Category, Response } = db;

// Importando middlewares
const isLoggedIn = require("./middlewares/isLoggedIn");
const isAuthor = require("./middlewares/isAuthor");

// Importando controllers
const IdeaController = require("./controller/ideaController");
const VoteController = require("./controller/VoteController");

const app = express();
const PORT = process.env.PORT || 3000;

// Importar rotas antigas
const categoryRoutes = require("./routes/CategoryRoutes");
const userRoutes = require("./routes/UserRoutes");
const ideaRoutes = require("./routes/IdeaRoutes");

app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/idea", ideaRoutes);


// Configuração de Segurança
// Helmet com CSP customizada para permitir os assets confiáveis (CDN) e recursos locais
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
        connectSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// Configuração do Handlebars com helpers
const helpers = {
  eq: (a, b) => a === b,
  includes: (arr, val) => arr && arr.includes(val),
  truncate: (str, length) => {
    if (str && str.length > length) {
      return str.substring(0, length) + '...';
    }
    return str;
  },
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
};

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    helpers,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para parsing de dados
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de Sessão
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "chave-super-secreta-mudeme",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  },
};

app.use(session(sessionConfig));

// Flash Messages
app.use(flash());

// CSRF Protection
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Middleware para disponibilizar dados nas views
app.use((req, res, next) => {
  res.locals.loggedUser = req.session.user || null;
  res.locals.messages = req.flash();
  res.locals.csrfToken = req.csrfToken();
  next();
});

// ===============================
// ROTAS DE AUTENTICAÇÃO
// ===============================

const bcrypt = require("bcryptjs");

// GET /login - Mostrar página de login
app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("auth/login", { layout: "authLayout" });
});

// GET /register - Mostrar página de registro
app.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("auth/register", { layout: "authLayout" });
});

// POST /register - Registrar novo usuário
app.post(
  "/register",
  [
    body("name", "Nome é obrigatório").trim().notEmpty(),
    body("email", "Email inválido").isEmail(),
    body("password", "Senha deve ter pelo menos 6 caracteres").isLength({
      min: 6,
    }),
    body("cpf", "CPF é obrigatório").trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("auth/register", {
          errors: errors.array(),
          formData: req.body,
          layout: "authLayout",
        });
      }

      const { name, email, password, cpf } = req.body;

      // Verificar se usuário já existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.flash("error", "Este email já está registrado");
        return res.render("auth/register", {
          error: "Este email já está registrado",
          formData: req.body,
          layout: "authLayout",
        });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        cpf,
      });

      req.session.user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      req.flash("success", "Registro realizado com sucesso!");
      res.redirect("/");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      req.flash("error", "Erro ao registrar usuário");
      res.render("auth/register", {
        error: "Erro ao registrar usuário",
        formData: req.body,
        layout: "authLayout",
      });
    }
  }
);


// POST /login - Login do usuário
app.post(
  "/login",
  [
    body("email", "Email inválido").isEmail(),
    body("password", "Senha é obrigatória").notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("auth/login", {
          errors: errors.array(),
          formData: req.body,
          layout: "authLayout",
        });
      }

      const { email, password } = req.body;

      // Buscar usuário
      const user = await User.findOne({ where: { email } });
      if (!user) {
        req.flash("error", "Email ou senha inválidos");
        return res.render("auth/login", {
          error: "Email ou senha inválidos",
          formData: req.body,
          layout: "authLayout",
        });
      }

      // Comparar senha
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        req.flash("error", "Email ou senha inválidos");
        return res.render("auth/login", {
          error: "Email ou senha inválidos",
          formData: req.body,
          layout: "authLayout",
        });
      }

      // Criar sessão
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      req.flash("success", `Bem-vindo, ${user.name}!`);
      res.redirect("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      req.flash("error", "Erro ao fazer login");
      res.render("auth/login", {
        error: "Erro ao fazer login",
        formData: req.body,
        layout: "authLayout",
      });
    }
  }
);



// POST /logout - Fazer logout (via form com CSRF)
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    // Ignorar erro na destruição da sessão e sempre limpar o cookie
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// GET /logout - Fallback para ambiente de desenvolvimento
app.get('/logout', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // Em produção, forçamos o uso de POST para logout (mais seguro)
    return res.status(405).send('Method Not Allowed');
  }
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// ===============================
// ROTAS DE IDEIAS
// ===============================

// GET / - Home - Listar todas as ideias
app.get("/", IdeaController.listIdeas);

// GET /ideas/create - Mostrar formulário de criar ideia
app.get("/ideas/create", isLoggedIn, IdeaController.showCreateForm);

// POST /ideas - Criar nova ideia
app.post(
  "/ideas",
  isLoggedIn,
  [
    body("title", "Título é obrigatório").trim().notEmpty().isLength({ min: 3 }),
    body("description", "Descrição é obrigatória")
      .trim()
      .notEmpty()
      .isLength({ min: 10 }),
  ],
  IdeaController.createIdea
);

// GET /ideas/:id - Ver detalhes da ideia
app.get("/ideas/:id", IdeaController.showIdea);

// GET /ideas/:id/edit - Mostrar formulário de edição
app.get("/ideas/:id/edit", isLoggedIn, isAuthor, IdeaController.showEditForm);

// POST /ideas/:id - Atualizar ideia
app.post(
  "/ideas/:id",
  isLoggedIn,
  isAuthor,
  [
    body("title", "Título é obrigatório").trim().notEmpty().isLength({ min: 3 }),
    body("description", "Descrição é obrigatória")
      .trim()
      .notEmpty()
      .isLength({ min: 10 }),
  ],
  IdeaController.updateIdea
);

// POST /ideas/:id/delete - Deletar ideia
app.post("/ideas/:id/delete", isLoggedIn, isAuthor, IdeaController.deleteIdea);

// ===============================
// ROTAS DE VOTAÇÃO
// ===============================

// POST /ideas/:ideaId/vote - Votar em uma ideia
app.post("/ideas/:ideaId/vote", isLoggedIn, VoteController.vote);

// POST /ideas/:ideaId/unvote - Remover voto de uma ideia
app.post("/ideas/:ideaId/unvote", isLoggedIn, VoteController.removeVote);

// ===============================
// ROTAS DE PERFIL
// ===============================

// GET /profile - Perfil do usuário logado
app.get("/profile", isLoggedIn, IdeaController.getUserIdeas);

// ===============================
// TRATAMENTO DE ERROS
// ===============================

// Middleware para capturar erros 404
app.use((req, res) => {
  res.status(404).render("error", {
    title: "404 - Página não encontrada",
    message: "A página que você procura não existe",
  });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error("Erro:", err);
  
  if (err.code === "EBADCSRFTOKEN") {
    req.flash("error", "Erro de segurança. Por favor, tente novamente.");
    return res.redirect(req.headers.referer || "/");
  }

  res.status(err.status || 500).render("error", {
    title: err.status || "500 - Erro Interno do Servidor",
    message: err.message || "Ocorreu um erro ao processar sua solicitação",
  });
});

// ===============================
// INICIALIZAÇÃO DO SERVIDOR
// ===============================

async function startServer() {
  try {
    // Sincronizar modelos com o banco de dados
    await db.sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✅ Modelos sincronizados com o banco de dados!");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log("💡 Pressione Ctrl+C para parar o servidor");
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
