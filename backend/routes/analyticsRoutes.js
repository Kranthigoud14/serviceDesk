const express = require("express");
const {
    getOverviewAnalytics,
    getTicketTrends,
    getTechnicianAnalytics,
    getAssetAnalytics
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/overview", protect, getOverviewAnalytics);
router.get("/trends", protect, authorize("System Admin", "IT Manager"), getTicketTrends);
router.get("/technicians", protect, authorize("System Admin", "IT Manager"), getTechnicianAnalytics);
router.get("/assets", protect, authorize("System Admin", "IT Manager", "Asset Manager"), getAssetAnalytics);

module.exports = router;
