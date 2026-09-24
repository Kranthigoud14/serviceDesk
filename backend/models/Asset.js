const mongoose = require("mongoose");

// ==========================================
// ASSET SCHEMA
// ==========================================

const assetSchema = new mongoose.Schema(
    {
        // ==========================================
        // ASSET NAME
        // ==========================================
        name: {
            type: String,
            required: true,
            trim: true
        },

        // ==========================================
        // ASSET TYPE
        // ==========================================
        type: {
            type: String,
            required: true,
            enum: [
                "Laptop",
                "Desktop",
                "Monitor",
                "Printer",
                "Keyboard",
                "Mouse",
                "Mobile",
                "Server",
                "Network Device",
                "Other"
            ]
        },

        // ==========================================
        // ASSET TAG / UNIQUE ID
        // ==========================================
        assetTag: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        // ==========================================
        // SERIAL NUMBER
        // ==========================================
        serialNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        // ==========================================
        // BRAND
        // ==========================================
        brand: {
            type: String,
            trim: true
        },

        // ==========================================
        // MODEL
        // ==========================================
        model: {
            type: String,
            trim: true
        },

        // ==========================================
        // STATUS
        // ==========================================
        status: {
            type: String,
            enum: [
                "Available",
                "Assigned",
                "Under Maintenance",
                "Retired"
            ],
            default: "Available"
        },

        // ==========================================
        // ASSIGNED EMPLOYEE
        // ==========================================
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // ==========================================
        // PURCHASE DATE
        // ==========================================
        purchaseDate: {
            type: Date,
            default: null
        },

        // ==========================================
        // WARRANTY EXPIRY
        // ==========================================
        warrantyExpiry: {
            type: Date,
            default: null
        },

        // ==========================================
        // DESCRIPTION
        // ==========================================
        description: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// ==========================================
// EXPORT MODEL
// ==========================================

module.exports = mongoose.model("Asset", assetSchema);