require("dotenv").config();

const categoryRoutes = require("./routes/CategoryRoutes");
const userRoutes = require("./routes/UserRoutes");
const ideaRoutes = require("./routes/IdeaRoutes");

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

// Importando conexão e modelos
const conn = require("./db/conn");
const User = require("./models/User");
const Address = require("./models/Address");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/idea", ideaRoutes);

function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}
const bcrypt = require("bcryptjs");

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
// ROTAS PRINCIPAIS
// ===============================

// Página inicial de login
app.get("/login", (req, res) => {
 res.render("login", { layout: "authLayout" });
});

// Registro de novo usuário
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.render("login", { error: "Preencha todos os campos" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render("login", { error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    req.session.user = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    res.redirect("/");
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.render("login", { error: "Erro ao registrar usuário" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render("login", { error: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render("login", { error: "Senha incorreta" });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.redirect("/");
  } catch (error) {
    console.error("Erro no login:", error);
    res.render("login", { error: "Erro ao fazer login" });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Página inicial - Lista todos os ideia
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

// ===============================
// ROTAS DE IDEIAS
// ===============================

// Página de cadastro de ideia
app.get("/users/create", checkAuth, (req, res) => {
  res.render("adduser");
});

// Criar novo ideia
app.post("/users/create", checkAuth, async (req, res) => {
  try {
    const { name, occupation, newsletter } = req.body;

    // Validação básica
    if (!name || name.trim().length < 2) {
      return res.render("adduser", {
        error: "Título deve ter pelo menos 2 caracteres",
        formData: { name, occupation, newsletter },
      });
    }

    const userData = {
      name: name.trim(),
      occupation: occupation ? occupation.trim() : null,
      newsletter: newsletter === "on",
    };

    const user = await User.create(userData);
    console.log("Ideia criada:", user.toJSON());

    res.redirect("/");
  } catch (error) {
    console.error("Erro ao criar ideia:", error);
    res.render("adduser", {
      error: "Erro ao criar ideia: " + error.message,
      formData: req.body,
    });
  }
});

// Ver detalhes de um ideia
app.get("/users/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Address,
          as: "addresses",
        },
      ],
    });

    if (!user) {
      return res.render("userview", {
        error: "Ideia não encontrada",
      });
    }

    res.render("userview", {
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Erro ao buscar ideia:", error);
    res.render("userview", {
      error: "Erro ao carregar ideia",
    });
  }
});

// Página de edição de ideia
app.get("/users/edit/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Address,
          as: "addresses",
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!user) {
      return res.redirect("/");
    }

    res.render("useredit", {
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Erro ao buscar ideia para edição:", error);
    res.redirect("/");
  }
});

// Atualizar ideia
app.post("/users/update", checkAuth, async (req, res) => {
  try {
    const { id, name, occupation, newsletter } = req.body;

    // Validação
    if (!name || name.trim().length < 2) {
      return res.redirect(`/users/edit/${id}`);
    }

    const updateData = {
      name: name.trim(),
      occupation: occupation ? occupation.trim() : null,
      newsletter: newsletter === "on",
    };

    const [updatedRows] = await User.update(updateData, {
      where: { id },
    });

    if (updatedRows === 0) {
      console.log("Nenhum ideia foi atualizado");
    } else {
      console.log(`Ideia ${id} atualizada com sucesso`);
    }

    res.redirect("/");
  } catch (error) {
    console.error("Erro ao atualizar ideia:", error);
    res.redirect(`/users/edit/${req.body.id || ""}`);
  }
});

// Excluir ideia
app.post("/users/delete/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Primeiro, deletar todos os endereços do ideia
    await Address.destroy({
      where: { userId: id },
    });

    // Depois, deletar o ideia
    const deletedRows = await User.destroy({
      where: { id },
    });

    if (deletedRows > 0) {
      console.log(`ideia ${id} e seus endereços foram excluídos`);
    } else {
      console.log("Nenhum ideia foi excluído");
    }

    res.redirect("/");
  } catch (error) {
    console.error("Erro ao excluir ideia:", error);
    res.redirect("/");
  }
});

// ===============================
// ROTAS DE ENDEREÇOS
// ===============================

// Criar novo endereço
app.post("/address/create", async (req, res) => {
  try {
    const { userId, street, number, city } = req.body;

    // Validação
    if (!street || street.trim().length < 5) {
      return res.redirect(`/users/edit/${userId}`);
    }

    if (!city || city.trim().length < 2) {
      return res.redirect(`/users/edit/${userId}`);
    }

    const addressData = {
      street: street.trim(),
      number: number ? number.trim() : null,
      city: city.trim(),
      userId,
    };

    const address = await Address.create(addressData);
    console.log("Endereço criado:", address.toJSON());

    res.redirect(`/users/edit/${userId}`);
  } catch (error) {
    console.error("Erro ao criar endereço:", error);
    res.redirect(`/users/edit/${req.body.userId || ""}`);
  }
});

// Excluir endereço
app.post("/address/delete", async (req, res) => {
  try {
    const { id, userId } = req.body;

    const deletedRows = await Address.destroy({
      where: { id },
    });

    if (deletedRows > 0) {
      console.log(`Endereço ${id} excluído`);
    }

    res.redirect(userId ? `/users/edit/${userId}` : "/");
  } catch (error) {
    console.error("Erro ao excluir endereço:", error);
    res.redirect("/");
  }
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
