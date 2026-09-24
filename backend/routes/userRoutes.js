const express = require("express");

const {
    getUsers,
    getUserById,
    updateUserName,
    deleteUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// USER MANAGEMENT ROUTES
// ==========================================

// GET all users
// GET /api/users
// Allowed: System Admin, IT Manager
router.get(
    "/",
    protect,
    authorize("IT Manager"),
    getUsers
);

// GET user by ID
// GET /api/users/:id
// Allowed: System Admin, IT Manager
router.get(
    "/:id",
    protect,
    authorize("IT Manager"),
    getUserById
);

// UPDATE OWN PROFILE
// PUT /api/users/profile
// Allowed: Every authenticated user
router.put(
    "/profile",
    protect,
    updateUserName
);

// UPDATE ANY USER
// PUT /api/users/:id
// Allowed: System Admin
router.put(
    "/:id",
    protect,
    authorize("System Admin"),
    updateUserName
);

// DELETE USER
// DELETE /api/users/:id
// Allowed: System Admin
router.delete(
    "/:id",
    protect,
    authorize("System Admin"),
    deleteUser
);

module.exports = router;
