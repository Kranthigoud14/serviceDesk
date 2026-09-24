const AuditLog = require("../models/AuditLog");

const logAction = async ({
    actor,
    action,
    entityType,
    entityId = null,
    description,
    metadata = {}
}) => {
    try {
        if (!actor) return;
        await AuditLog.create({
            actor,
            action,
            entityType,
            entityId: entityId ? entityId.toString() : null,
            description,
            metadata
        });
    } catch (error) {
        console.error("Audit log creation error (non-fatal):", error.message);
    }
};

module.exports = {
    logAction
};
