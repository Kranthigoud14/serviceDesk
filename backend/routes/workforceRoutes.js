const express = require("express");

const {
    recommendTechnicians
} = require("../controllers/workforceController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// RECOMMEND TECHNICIANS FOR A TICKET
// ==========================================

router.get(
    "/recommend/:ticketId",
    protect,
    authorize("IT Manager"),
    recommendTechnicians
);

module.exports = router;