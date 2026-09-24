const express = require("express");

const {
    getTechnicians,
    getTechnicianById,
    updateOwnTechnicianSkills,
    verifyTechnicianSkills,
    updateTechnicianAvailability,
    updateTechnicianCapacity
} = require("../controllers/technicianController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// GET ALL TECHNICIANS
// ==========================================

router.get(
    "/",
    protect,
    authorize("IT Manager"),
    getTechnicians
);

// ==========================================
// GET TECHNICIAN BY ID
// ==========================================

router.get(
    "/:id",
    protect,
    authorize("IT Manager", "Technician"),
    getTechnicianById
);

// ==========================================
// TECHNICIAN UPDATES OWN SKILLS
// ==========================================

router.put(
    "/me/skills",
    protect,
    authorize("Technician"),
    updateOwnTechnicianSkills
);

// ==========================================
// IT MANAGER VERIFIES TECHNICIAN SKILLS
// ==========================================

router.put(
    "/:id/skills/verify",
    protect,
    authorize("IT Manager"),
    verifyTechnicianSkills
);

// ==========================================
// UPDATE TECHNICIAN AVAILABILITY
// ==========================================

router.put(
    "/:id/availability",
    protect,
    authorize("Technician", "IT Manager"),
    updateTechnicianAvailability
);

// ==========================================
// UPDATE TECHNICIAN CAPACITY
// ==========================================

router.put(
    "/:id/capacity",
    protect,
    authorize("IT Manager"),
    updateTechnicianCapacity
);

module.exports = router;