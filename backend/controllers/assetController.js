const Asset = require("../models/Asset");
const User = require("../models/User");

// ==========================================
// CREATE ASSET
// ==========================================
const createAsset = async (req, res) => {
    try {
        const {
            name,
            type,
            assetTag,
            serialNumber,
            brand,
            model,
            purchaseDate,
            warrantyExpiry,
            description
        } = req.body;

        if (!name || !type || !assetTag) {
            return res.status(400).json({
                message: "Name, type and asset tag are required"
            });
        }

        const existingAsset = await Asset.findOne({ assetTag });

        if (existingAsset) {
            return res.status(400).json({
                message: "Asset tag already exists"
            });
        }

        const asset = await Asset.create({
            name: name.trim(),
            type,
            assetTag: assetTag.trim(),
            serialNumber: serialNumber?.trim(),
            brand: brand?.trim(),
            model: model?.trim(),
            purchaseDate,
            warrantyExpiry,
            description: description?.trim()
        });

        res.status(201).json({
            message: "Asset created successfully",
            asset
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create asset",
            error: error.message
        });
    }
};

// ==========================================
// GET ALL ASSETS
// ==========================================
const getAssets = async (req, res) => {
    try {
        const assets = await Asset.find()
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch assets",
            error: error.message
        });
    }
};

// ==========================================
// GET ASSET BY ID
// ==========================================
const getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id)
            .populate("assignedTo", "name email role");

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch asset",
            error: error.message
        });
    }
};

// ==========================================
// UPDATE ASSET
// ==========================================
const updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        const {
            name,
            type,
            brand,
            model,
            status,
            purchaseDate,
            warrantyExpiry,
            description
        } = req.body;

        if (name !== undefined) asset.name = name.trim();
        if (type !== undefined) asset.type = type;
        if (brand !== undefined) asset.brand = brand.trim();
        if (model !== undefined) asset.model = model.trim();
        if (status !== undefined) asset.status = status;
        if (purchaseDate !== undefined) asset.purchaseDate = purchaseDate;
        if (warrantyExpiry !== undefined) {
            asset.warrantyExpiry = warrantyExpiry;
        }
        if (description !== undefined) {
            asset.description = description.trim();
        }

        const updatedAsset = await asset.save();

        res.status(200).json({
            message: "Asset updated successfully",
            asset: updatedAsset
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update asset",
            error: error.message
        });
    }
};

// ==========================================
// ASSIGN ASSET
// ==========================================
const assignAsset = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        asset.assignedTo = userId;
        asset.status = "Assigned";

        const updatedAsset = await asset.save();

        res.status(200).json({
            message: "Asset assigned successfully",
            asset: updatedAsset
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to assign asset",
            error: error.message
        });
    }
};

// ==========================================
// UNASSIGN ASSET
// ==========================================
const unassignAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        asset.assignedTo = null;
        asset.status = "Available";

        const updatedAsset = await asset.save();

        res.status(200).json({
            message: "Asset unassigned successfully",
            asset: updatedAsset
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to unassign asset",
            error: error.message
        });
    }
};

// ==========================================
// DELETE ASSET
// ==========================================
const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }

        await Asset.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Asset deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete asset",
            error: error.message
        });
    }
};

module.exports = {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    assignAsset,
    unassignAsset,
    deleteAsset
};