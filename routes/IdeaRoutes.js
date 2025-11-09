const express = require("express");
const router = express.Router();
const IdeaController = require("../controller/IdeaController");

router.get("/", IdeaController.index);
router.get("/:id", IdeaController.show);
router.post("/", IdeaController.store);
router.put("/:id", IdeaController.update);
router.delete("/:id", IdeaController.delete);

module.exports = router;
