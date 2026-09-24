const express = require("express");

const {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    assignAsset,
    unassignAsset,
    deleteAsset
} = require("../controllers/assetController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// CREATE ASSET
// ==========================================
// Asset Manager and System Admin
router.post(
    "/",
    protect,
    authorize("Asset Manager"),
    createAsset
);

// ==========================================
// GET ALL ASSETS
// ==========================================
// Asset Manager, IT Manager and System Admin
router.get(
    "/",
    protect,
    authorize("Asset Manager", "IT Manager"),
    getAssets
);

// ==========================================
// GET ASSET BY ID
// ==========================================
// Asset Manager, IT Manager and System Admin
router.get(
    "/:id",
    protect,
    authorize("Asset Manager", "IT Manager"),
    getAssetById
);

// ==========================================
// UPDATE ASSET
// ==========================================
// Asset Manager and System Admin
router.put(
    "/:id",
    protect,
    authorize("Asset Manager"),
    updateAsset
);

// ==========================================
// ASSIGN ASSET
// ==========================================
// Asset Manager and System Admin
router.put(
    "/:id/assign",
    protect,
    authorize("Asset Manager"),
    assignAsset
);

// ==========================================
// UNASSIGN ASSET
// ==========================================
// Asset Manager and System Admin
router.put(
    "/:id/unassign",
    protect,
    authorize("Asset Manager"),
    unassignAsset
);

// ==========================================
// DELETE ASSET
// ==========================================
// System Admin only
router.delete(
    "/:id",
    protect,
    authorize("System Admin"),
    deleteAsset
);

module.exports = router;