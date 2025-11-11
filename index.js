require("dotenv").config();

const categoryRoutes = require("./routes/CategoryRoutes");
const userRoutes = require("./routes/UserRoutes");
const ideaRoutes = require("./routes/IdeaRoutes");
const authRoutes = require("./routes/AuthRoutes");
const checkAuth = require("./checkAuth")

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

// Importando conexão e modelos
const conn = require("./db/conn");
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Handlebars
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
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

// Sessão (para login)
const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "chave-super-secreta",
    resave: false,
    saveUninitialized: false,
  })
);
app.get("/login", (req, res) => {
 res.render("login", { layout: "authLayout" });
});

app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/idea", ideaRoutes)
app.use("/api/v1/auth", authRoutes)

app.get("/", checkAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]], // Mais recentes primeiro
      raw: true,
    });

    console.log(`Encontrados ${users.length} ideias `);
    res.render("home", { users });
  } catch (error) {
    console.error("Erro ao buscar ideias:", error);
    res.render("home", {
      users: [],
      error: "Erro ao carregar ideias",
    });
  }
});

// Middleware para disponibilizar o usuário logado nas views
app.use((req, res, next) => {
  res.locals.loggedUser = req.session.user || null;
  next();
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));
// Servir pasta `assets` com imagens e outros arquivos que estão na raiz
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Middleware de log das requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===============================
// TRATAMENTO DE ERROS 404
// ===============================
app.use((req, res) => {
  res.status(404).render("home", {
    users: [],
    error: "Página não encontrada",
  });
});

// ===============================
// INICIALIZAÇÃO DO SERVIDOR
// ===============================
async function startServer() {
  try {
    // Sincronizar modelos com o banco de dados
    await conn.sync();
    console.log("✅ Modelos sincronizados com o banco de dados!");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log("💡 Pressione Ctrl+C para parar o servidor");
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
