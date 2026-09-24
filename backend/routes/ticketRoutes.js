const express = require("express");

const {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    assignTicket,
    resolveTicket,
    verifyService,
    rejectService,
    rateTechnician,
    deleteTicket
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// CREATE TICKET
// ==========================================

router.post(
    "/",
    protect,
    authorize(
        "Employee",
        "Technician",
        "IT Manager",
        "Asset Manager"
    ),
    createTicket
);

// ==========================================
// GET ALL TICKETS
// ==========================================

router.get(
    "/",
    protect,
    authorize(
        "IT Manager",
        "Employee",
        "Technician",
        "Asset Manager"
    ),
    getTickets
);

// ==========================================
// GET TICKET BY ID
// ==========================================

router.get(
    "/:id",
    protect,
    authorize(
        "IT Manager",
        "Employee",
        "Technician",
        "Asset Manager"
    ),
    getTicketById
);

// ==========================================
// UPDATE TICKET
// ==========================================

router.put(
    "/:id",
    protect,
    authorize("IT Manager"),
    updateTicket
);

// ==========================================
// ASSIGN TICKET
// ==========================================

router.put(
    "/:id/assign",
    protect,
    authorize("IT Manager"),
    assignTicket
);

// ==========================================
// TECHNICIAN RESOLVES TICKET
// ==========================================

router.put(
    "/:id/resolve",
    protect,
    authorize("Technician"),
    resolveTicket
);

// ==========================================
// EMPLOYEE VERIFIES SERVICE
// ==========================================

router.put(
    "/:id/verify-service",
    protect,
    authorize("Employee"),
    verifyService
);

// ==========================================
// EMPLOYEE REJECTS SERVICE
// ==========================================

router.put(
    "/:id/reject-service",
    protect,
    authorize("Employee"),
    rejectService
);

// ==========================================
// EMPLOYEE RATES TECHNICIAN
// ==========================================

router.put(
    "/:id/rate",
    protect,
    authorize("Employee"),
    rateTechnician
);

// ==========================================
// DELETE TICKET
// ==========================================

router.delete(
    "/:id",
    protect,
    authorize("System Admin"),
    deleteTicket
);

module.exports = router;