const express = require("express");
const {
    getArticles,
    getCategories,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = require("../controllers/knowledgeController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/categories", protect, getCategories);
router.get("/", protect, getArticles);
router.get("/:id", protect, getArticleById);

router.post("/", protect, authorize("System Admin", "IT Manager"), createArticle);
router.put("/:id", protect, authorize("System Admin", "IT Manager"), updateArticle);
router.delete("/:id", protect, authorize("System Admin", "IT Manager"), deleteArticle);

module.exports = router;
