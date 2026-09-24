const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Hardware",
                "Software",
                "Network",
                "Access",
                "Email",
                "Other"
            ]
        },

        priority: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical"
            ],
            default: "Medium"
        },

        status: {
            type: String,
            enum: [
                "Open",
                "Assigned",
                "In Progress",
                "Resolved",
                "Closed",
                "Reopened"
            ],
            default: "Open"
        },

        // ==========================================
        // SLA
        // ==========================================

        slaDueAt: {
            type: Date,
            default: null
        },

        slaWarningSent: {
            type: Boolean,
            default: false
        },

        slaBreachSent: {
            type: Boolean,
            default: false
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // ==========================================
        // RESOLUTION
        // ==========================================

        resolution: {
            type: String,
            trim: true,
            default: ""
        },

        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        resolvedAt: {
            type: Date,
            default: null
        },

        // ==========================================
        // SERVICE PROOF
        // ==========================================

        proofPhoto: {
            type: String,
            trim: true,
            default: ""
        },

        // ==========================================
        // SERVICE VERIFICATION OTP
        // ==========================================

        verificationOtp: {
            type: String,
            default: null
        },

        verificationOtpExpiresAt: {
            type: Date,
            default: null
        },

        // ==========================================
        // SERVICE VERIFIED
        // ==========================================

        serviceVerifiedAt: {
            type: Date,
            default: null
        },

        serviceVerifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // ==========================================
        // SERVICE REJECTION
        // ==========================================

        serviceRejectedAt: {
            type: Date,
            default: null
        },

        serviceRejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        rejectionReason: {
            type: String,
            trim: true,
            default: ""
        },

        // ==========================================
        // EMPLOYEE RATING
        // ==========================================

        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        },

        ratingComment: {
            type: String,
            trim: true,
            default: ""
        },

        ratedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        ratedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Ticket",
    ticketSchema
);
