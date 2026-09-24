const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        action: {
            type: String,
            required: true,
            trim: true
        },
        entityType: {
            type: String,
            required: true,
            enum: [
                "AUTH",
                "USER",
                "TICKET",
                "TECHNICIAN",
                "ASSET",
                "KNOWLEDGE",
                "SYSTEM"
            ]
        },
        entityId: {
            type: String,
            default: null
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ entityType: 1, action: 1 });
auditLogSchema.index({ actor: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
