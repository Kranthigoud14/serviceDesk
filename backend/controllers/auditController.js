const AuditLog = require("../models/AuditLog");

// @desc    Get audit logs
// @route   GET /api/audit-logs
// @access  Private (System Admin)
const getAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const { search, entityType, action, actor, startDate, endDate } = req.query;

        const query = {};

        if (entityType) {
            query.entityType = entityType;
        }

        if (action) {
            query.action = action;
        }

        if (actor) {
            query.actor = actor;
        }

        if (search) {
            query.$or = [
                { description: { $regex: search, $options: "i" } },
                { action: { $regex: search, $options: "i" } }
            ];
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        const total = await AuditLog.countDocuments(query);
        const logs = await AuditLog.find(query)
            .populate("actor", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            count: logs.length,
            logs
        });
    } catch (error) {
        console.error("Get audit logs error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve audit logs",
            error: error.message
        });
    }
};

module.exports = {
    getAuditLogs
};
