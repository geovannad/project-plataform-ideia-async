const express = require("express");
const router = express.Router();
const CategoryController = require("../controller/CategoryController");

router.get("/", CategoryController.index);
router.get("/:id", CategoryController.show);
router.post("/", CategoryController.store);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete);

module.exports = router;
