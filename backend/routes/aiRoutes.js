const express = require("express");
const {
    summarize,
    classify,
    suggestSteps,
    getInsights
} = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/summarize", protect, summarize);
router.post("/classify", protect, classify);
router.post("/suggest-resolution", protect, suggestSteps);
router.get("/insights/:ticketId", protect, getInsights);

module.exports = router;
