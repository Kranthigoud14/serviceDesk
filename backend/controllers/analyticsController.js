const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Asset = require("../models/Asset");

// @desc    Get system-wide overview analytics
// @route   GET /api/analytics/overview
// @access  Private
const getOverviewAnalytics = async (req, res) => {
    try {
        const { timeframe = "30" } = req.query; // days
        const days = parseInt(timeframe, 10) || 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        // Ticket Status Counts
        const statusAggregation = await Ticket.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const statusMap = statusAggregation.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        // Ticket Priority Counts
        const priorityAggregation = await Ticket.aggregate([
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        // Category Breakdown
        const categoryAggregation = await Ticket.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Total Tickets
        const totalTickets = await Ticket.countDocuments();
        const activeTickets = await Ticket.countDocuments({
            status: { $in: ["Open", "Assigned", "In Progress", "Reopened"] }
        });
        const resolvedTickets = await Ticket.countDocuments({
            status: { $in: ["Resolved", "Closed"] }
        });

        // SLA Metrics
        const now = new Date();
        const ticketsWithSla = await Ticket.find({ slaDueAt: { $ne: null } });
        let slaMetCount = 0;
        let slaBreachedCount = 0;
        let slaAtRiskCount = 0;

        ticketsWithSla.forEach(t => {
            if (t.status === "Resolved" || t.status === "Closed") {
                if (t.resolvedAt && t.resolvedAt <= t.slaDueAt) {
                    slaMetCount++;
                } else if (!t.resolvedAt && t.updatedAt <= t.slaDueAt) {
                    slaMetCount++;
                } else {
                    slaBreachedCount++;
                }
            } else {
                if (now > t.slaDueAt) {
                    slaBreachedCount++;
                } else {
                    const hoursLeft = (t.slaDueAt - now) / (1000 * 60 * 60);
                    if (hoursLeft <= 2) {
                        slaAtRiskCount++;
                    }
                }
            }
        });

        const totalSlaEvaluated = slaMetCount + slaBreachedCount;
        const slaComplianceRate = totalSlaEvaluated > 0 
            ? Math.round((slaMetCount / totalSlaEvaluated) * 100) 
            : 100;

        // Technician Stats
        const totalTechnicians = await User.countDocuments({ role: "Technician" });
        const availableTechnicians = await User.countDocuments({ 
            role: "Technician", 
            availability: "Available" 
        });

        // Asset Stats
        const totalAssets = await Asset.countDocuments();
        const assignedAssets = await Asset.countDocuments({ status: "Assigned" });
        const availableAssets = await Asset.countDocuments({ status: "Available" });

        // Rating Stats
        const ratingAggregation = await Ticket.aggregate([
            { $match: { rating: { $ne: null } } },
            { 
                $group: { 
                    _id: null, 
                    avgRating: { $avg: "$rating" }, 
                    totalRatings: { $sum: 1 } 
                } 
            }
        ]);
        const avgRating = ratingAggregation.length > 0 
            ? parseFloat(ratingAggregation[0].avgRating.toFixed(2)) 
            : 5.0;
        const totalRatings = ratingAggregation.length > 0 
            ? ratingAggregation[0].totalRatings 
            : 0;

        res.status(200).json({
            success: true,
            summary: {
                totalTickets,
                activeTickets,
                resolvedTickets,
                totalTechnicians,
                availableTechnicians,
                totalAssets,
                assignedAssets,
                availableAssets,
                slaComplianceRate,
                slaBreachedCount,
                slaAtRiskCount,
                avgRating,
                totalRatings
            },
            statusBreakdown: statusMap,
            priorityBreakdown: priorityAggregation,
            categoryBreakdown: categoryAggregation
        });
    } catch (error) {
        console.error("Overview analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate overview analytics",
            error: error.message
        });
    }
};

// @desc    Get ticket creation and resolution trends
// @route   GET /api/analytics/trends
// @access  Private
const getTicketTrends = async (req, res) => {
    try {
        const days = parseInt(req.query.days, 10) || 14;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        const createdTrends = await Ticket.aggregate([
            { $match: { createdAt: { $gte: cutoff } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const resolvedTrends = await Ticket.aggregate([
            { $match: { resolvedAt: { $gte: cutoff } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$resolvedAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            days,
            created: createdTrends,
            resolved: resolvedTrends
        });
    } catch (error) {
        console.error("Trends analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate trends analytics",
            error: error.message
        });
    }
};

// @desc    Get technician performance analytics
// @route   GET /api/analytics/technicians
// @access  Private
const getTechnicianAnalytics = async (req, res) => {
    try {
        const technicians = await User.find({ role: "Technician" }).select("name email skills availability maxActiveTickets skillsVerified");

        const techStats = await Promise.all(technicians.map(async (tech) => {
            const activeTickets = await Ticket.countDocuments({
                assignedTo: tech._id,
                status: { $in: ["Assigned", "In Progress", "Reopened"] }
            });

            const resolvedTickets = await Ticket.countDocuments({
                assignedTo: tech._id,
                status: { $in: ["Resolved", "Closed"] }
            });

            const ratingAgg = await Ticket.aggregate([
                { $match: { assignedTo: tech._id, rating: { $ne: null } } },
                { $group: { _id: null, avg: { $avg: "$rating" }, total: { $sum: 1 } } }
            ]);

            const maxCapacity = tech.maxActiveTickets || 5;
            const utilization = Math.min(Math.round((activeTickets / maxCapacity) * 100), 100);

            return {
                id: tech._id,
                name: tech.name,
                email: tech.email,
                availability: tech.availability,
                skillsVerified: tech.skillsVerified,
                skills: tech.skills,
                activeTickets,
                resolvedTickets,
                maxCapacity,
                utilization,
                averageRating: ratingAgg.length > 0 ? parseFloat(ratingAgg[0].avg.toFixed(1)) : null,
                totalRatings: ratingAgg.length > 0 ? ratingAgg[0].total : 0
            };
        }));

        res.status(200).json({
            success: true,
            count: techStats.length,
            technicians: techStats
        });
    } catch (error) {
        console.error("Technician analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate technician analytics",
            error: error.message
        });
    }
};

// @desc    Get asset metrics
// @route   GET /api/analytics/assets
// @access  Private
const getAssetAnalytics = async (req, res) => {
    try {
        const byType = await Asset.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const byStatus = await Asset.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const now = new Date();
        const expiredWarranty = await Asset.countDocuments({
            warrantyExpiry: { $ne: null, $lt: now }
        });

        const activeWarranty = await Asset.countDocuments({
            warrantyExpiry: { $ne: null, $gte: now }
        });

        const total = await Asset.countDocuments();
        const assigned = await Asset.countDocuments({ status: "Assigned" });

        res.status(200).json({
            success: true,
            total,
            assigned,
            assignmentRate: total > 0 ? Math.round((assigned / total) * 100) : 0,
            byType,
            byStatus,
            warranty: {
                active: activeWarranty,
                expired: expiredWarranty
            }
        });
    } catch (error) {
        console.error("Asset analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate asset analytics",
            error: error.message
        });
    }
};

module.exports = {
    getOverviewAnalytics,
    getTicketTrends,
    getTechnicianAnalytics,
    getAssetAnalytics
};
