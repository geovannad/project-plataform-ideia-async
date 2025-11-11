const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");

// Tela de login/cadastro
router.get("/auth", (req, res) => {
  res.render("auth", { layout: "authLayout" });
});

// Cadastro de usuário
router.post("/register", async (req, res) => {
  try {
    const { name, cpf, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render("auth", { layout: "authLayout", error: "Email já cadastrado!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      cpf,
      email,
      password: hashedPassword,
      created_date: new Date(),
    });

    res.render("auth", { layout: "authLayout", success: "Cadastro realizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.render("auth", { layout: "authLayout", error: "Erro ao cadastrar." });
  }
});

// Login de usuário
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render("auth", { layout: "authLayout", error: "Usuário não encontrado." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.render("auth", { layout: "authLayout", error: "Senha incorreta." });
    }

    req.session.userId = user.id;
    req.session.user = user;

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.render("auth", { layout: "authLayout", error: "Erro no login." });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth");
});

module.exports = router;
