const express = require("express");
const router = express.Router();
const IdeaController = require("../controller/ideaController");

// Manter rotas antigas da API (compatibilidade)
router.get("/", IdeaController.listIdeas);
router.get("/:id", IdeaController.showIdea);
router.post("/", IdeaController.createIdea);
router.put("/:id", IdeaController.updateIdea);
router.delete("/:id", IdeaController.deleteIdea);

module.exports = router;
