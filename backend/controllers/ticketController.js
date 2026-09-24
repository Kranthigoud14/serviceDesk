const Ticket = require("../models/Ticket");
const User = require("../models/User");

const {
    createNotification
} = require("../services/notificationService");

const {
    calculateSlaDueAt,
    getSlaStatus
} = require("../utils/sla");

// ==========================================
// GENERATE 6 DIGIT OTP
// ==========================================

const generateOtp = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

// ==========================================
// CREATE TICKET
// ==========================================

const createTicket = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                message:
                    "Title, description and category are required"
            });
        }

        const ticketPriority =
            priority || "Medium";

        const slaDueAt =
            calculateSlaDueAt(
                ticketPriority
            );

        const ticket =
            await Ticket.create({
                title: title.trim(),
                description:
                    description.trim(),
                category,
                priority:
                    ticketPriority,
                createdBy:
                    req.user.userId,
                slaDueAt
            });

        res.status(201).json({
            message:
                "Ticket created successfully",
            ticket
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to create ticket",
            error: error.message
        });
    }
};

// ==========================================
// GET ALL TICKETS
// ==========================================

const getTickets = async (req, res) => {
    try {
        const tickets =
            await Ticket.find()
                .populate(
                    "createdBy",
                    "name email role"
                )
                .populate(
                    "assignedTo",
                    "name email role"
                )
                .populate(
                    "resolvedBy",
                    "name email role"
                )
                .populate(
                    "serviceVerifiedBy",
                    "name email role"
                )
                .populate(
                    "serviceRejectedBy",
                    "name email role"
                )
                .populate(
                    "ratedBy",
                    "name email role"
                )
                .sort({
                    createdAt: -1
                });

        const ticketsWithSla =
            tickets.map((ticket) => ({
                ...ticket.toObject(),

                slaStatus:
                    getSlaStatus(
                        ticket.slaDueAt,
                        ticket.status
                    )
            }));

        res.status(200).json(
            ticketsWithSla
        );

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch tickets",
            error: error.message
        });
    }
};

// ==========================================
// GET TICKET BY ID
// ==========================================

const getTicketById = async (req, res) => {
    try {
        const ticket =
            await Ticket.findById(
                req.params.id
            )
                .populate(
                    "createdBy",
                    "name email role"
                )
                .populate(
                    "assignedTo",
                    "name email role"
                )
                .populate(
                    "resolvedBy",
                    "name email role"
                )
                .populate(
                    "serviceVerifiedBy",
                    "name email role"
                )
                .populate(
                    "serviceRejectedBy",
                    "name email role"
                )
                .populate(
                    "ratedBy",
                    "name email role"
                );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Ticket not found"
            });
        }

        const ticketData = {
            ...ticket.toObject(),

            slaStatus:
                getSlaStatus(
                    ticket.slaDueAt,
                    ticket.status
                )
        };

        res.status(200).json(
            ticketData
        );

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch ticket",
            error: error.message
        });
    }
};

// ==========================================
// UPDATE TICKET
// ==========================================

const updateTicket = async (req, res) => {
    try {
        const ticket =
            await Ticket.findById(
                req.params.id
            );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Ticket not found"
            });
        }

        const {
            title,
            description,
            category,
            priority,
            status
        } = req.body;

        if (title !== undefined) {
            ticket.title =
                title.trim();
        }

        if (description !== undefined) {
            ticket.description =
                description.trim();
        }

        if (category !== undefined) {
            ticket.category =
                category;
        }

        if (priority !== undefined) {
            ticket.priority =
                priority;

            ticket.slaDueAt =
                calculateSlaDueAt(
                    priority,
                    ticket.createdAt
                );

            // Reset SLA notification flags because
            // the SLA deadline has been recalculated.

            ticket.slaWarningSent = false;
            ticket.slaBreachSent = false;
        }

        if (status !== undefined) {
            ticket.status =
                status;
        }

        const updatedTicket =
            await ticket.save();

        res.status(200).json({
            message:
                "Ticket updated successfully",
            ticket: updatedTicket
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to update ticket",
            error: error.message
        });
    }
};

// ==========================================
// ASSIGN TICKET
// ==========================================

const assignTicket = async (req, res) => {
    try {
        const {
            technicianId
        } = req.body;

        if (!technicianId) {
            return res.status(400).json({
                message:
                    "Technician ID is required"
            });
        }

        const technician =
            await User.findById(
                technicianId
            );

        if (!technician) {
            return res.status(404).json({
                message:
                    "Technician not found"
            });
        }

        if (
            technician.role !==
            "Technician"
        ) {
            return res.status(400).json({
                message:
                    "Selected user is not a Technician"
            });
        }

        const ticket =
            await Ticket.findById(
                req.params.id
            );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Ticket not found"
            });
        }

        ticket.assignedTo =
            technicianId;

        ticket.status =
            "Assigned";

        const updatedTicket =
            await ticket.save();

        // ==========================================
        // NOTIFY TECHNICIAN
        // ==========================================

        await createNotification({
            recipient: technicianId,
            title:
                "New Ticket Assigned",
            message:
                `Ticket "${ticket.title}" has been assigned to you.`,
            type:
                "TICKET_ASSIGNED",
            relatedTicket:
                ticket._id
        });

        res.status(200).json({
            message:
                "Ticket assigned successfully",
            ticket: updatedTicket
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to assign ticket",
            error: error.message
        });
    }
};

// ==========================================
// RESOLVE TICKET WITH SERVICE PROOF
// ==========================================

const resolveTicket = async (req, res) => {
    try {
        const {
            resolution,
            proofPhoto
        } = req.body;

        if (
            !resolution ||
            resolution.trim() === ""
        ) {
            return res.status(400).json({
                message:
                    "Resolution is required"
            });
        }

        if (
            !proofPhoto ||
            proofPhoto.trim() === ""
        ) {
            return res.status(400).json({
                message:
                    "Proof photo is required"
            });
        }

        const ticket =
            await Ticket.findById(
                req.params.id
            );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Ticket not found"
            });
        }

        if (
            req.user.role ===
            "Technician"
        ) {
            if (
                !ticket.assignedTo ||
                ticket.assignedTo.toString() !==
                    req.user.userId
            ) {
                return res.status(403).json({
                    message:
                        "You can only resolve tickets assigned to you"
                });
            }
        }

        const verificationOtp =
            generateOtp();

        const verificationOtpExpiresAt =
            new Date(
                Date.now() +
                    10 * 60 * 1000
            );

        ticket.resolution =
            resolution.trim();

        ticket.proofPhoto =
            proofPhoto.trim();

        ticket.resolvedBy =
            req.user.userId;

        ticket.resolvedAt =
            new Date();

        ticket.status =
            "Resolved";

        ticket.verificationOtp =
            verificationOtp;

        ticket.verificationOtpExpiresAt =
            verificationOtpExpiresAt;

        ticket.serviceVerifiedAt =
            null;

        ticket.serviceVerifiedBy =
            null;

        ticket.serviceRejectedAt =
            null;

        ticket.serviceRejectedBy =
            null;

        ticket.rejectionReason =
            "";

        const updatedTicket =
            await ticket.save();

        // ==========================================
        // NOTIFY EMPLOYEE
        // ==========================================

        await createNotification({
            recipient:
                ticket.createdBy,
            title:
                "Service Resolved",
            message:
                `Your ticket "${ticket.title}" has been resolved. Please verify the service using the OTP.`,
            type:
                "TICKET_RESOLVED",
            relatedTicket:
                ticket._id
        });

        res.status(200).json({
            message:
                "Ticket resolved successfully. Service verification OTP generated.",

            ticket: {
                id: updatedTicket._id,
                title: updatedTicket.title,
                status:
                    updatedTicket.status,
                resolution:
                    updatedTicket.resolution,
                proofPhoto:
                    updatedTicket.proofPhoto,
                resolvedBy:
                    updatedTicket.resolvedBy,
                resolvedAt:
                    updatedTicket.resolvedAt
            },

            // DEVELOPMENT ONLY
            verificationOtp,

            verificationOtpExpiresAt
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to resolve ticket",
            error: error.message
        });
    }
};

// ==========================================
// EMPLOYEE VERIFIES SERVICE USING OTP
// ==========================================

const verifyService = async (req, res) => {
    try {
        const {
            otp
        } = req.body;

        if (
            !otp ||
            otp.trim() === ""
        ) {
            return res.status(400).json({
                message:
                    "OTP is required"
            });
        }

        const ticket =
            await Ticket.findById(
                req.params.id
            );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Ticket not found"
            });
        }

        if (
            ticket.status !==
            "Resolved"
        ) {
            return res.status(400).json({
                message:
                    "Only resolved tickets can be verified"
            });
        }

        if (
            ticket.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "Only the employee who created the ticket can verify the service"
            });
        }

        if (
            ticket.verificationOtp !==
            otp.trim()
        ) {
            return res.status(400).json({
                message:
                    "Invalid OTP"
            });
        }

        if (
            !ticket.verificationOtpExpiresAt ||
            new Date() >
                ticket.verificationOtpExpiresAt
        ) {
            return res.status(400).json({
                message:
                    "OTP has expired"
            });
        }

        ticket.serviceVerifiedAt =
            new Date();

        ticket.serviceVerifiedBy =
            req.user.userId;

        ticket.status =
            "Closed";

        ticket.verificationOtp =
            null;

        ticket.verificationOtpExpiresAt =
            null;

        const updatedTicket =
            await ticket.save();

        // ==========================================
        // NOTIFY TECHNICIAN
        // ==========================================

        if (ticket.assignedTo) {
            await createNotification({
                recipient:
                    ticket.assignedTo,
                title:
                    "Service Verified",
                message:
                    `The service for ticket "${ticket.title}" has been verified by the employee.`,
                type:
                    "VERIFICATION_COMPLETED",
                relatedTicket:
                    ticket._id
            });
        }

        res.status(200).json({
            message:
                "Service verified successfully. Ticket closed.",

            ticket: {
                id: updatedTicket._id,
                status:
                    updatedTicket.status,
                serviceVerifiedAt:
                    updatedTicket.serviceVerifiedAt,
                serviceVerifiedBy:
                    updatedTicket.serviceVerifiedBy
            }
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to verify service",
            error: error.message
        });
    }
};

// ==========================================
// EMPLOYEE REJECTS SERVICE
// ==========================================

const rejectService = async (req, res) => {
    try {
        const {
            rejectionReason
        } = req.body;

        if (
            !rejectionReason ||
            rejectionReason.trim() === ""
        ) {
            return res.status(400).json({
                message:
                    "Rejection reason is required"
            });
        }

        const ticket =
            await Ticket.findById(
                req.params.id
            );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Ticket not found"
            });
        }

        if (
            ticket.status !==
            "Resolved"
        ) {
            return res.status(400).json({
                message:
                    "Only resolved tickets can be rejected"
            });
        }

        if (
            ticket.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "Only the employee who created the ticket can reject the service"
            });
        }

        ticket.serviceRejectedAt =
            new Date();

        ticket.serviceRejectedBy =
            req.user.userId;

        ticket.rejectionReason =
            rejectionReason.trim();

        ticket.status =
            "Reopened";

        ticket.verificationOtp =
            null;

        ticket.verificationOtpExpiresAt =
            null;

        ticket.serviceVerifiedAt =
            null;

        ticket.serviceVerifiedBy =
            null;

        const updatedTicket =
            await ticket.save();

        // ==========================================
        // NOTIFY TECHNICIAN
        // ==========================================

        if (ticket.assignedTo) {
            await createNotification({
                recipient:
                    ticket.assignedTo,
                title:
                    "Service Rejected",
                message:
                    `The employee rejected the service for ticket "${ticket.title}". Reason: ${ticket.rejectionReason}`,
                type:
                    "TICKET_UPDATED",
                relatedTicket:
                    ticket._id
            });
        }

        res.status(200).json({
            message:
                "Service rejected successfully. Ticket has been reopened.",

            ticket: {
                id: updatedTicket._id,
                status:
                    updatedTicket.status,
                rejectionReason:
                    updatedTicket.rejectionReason,
                serviceRejectedAt:
                    updatedTicket.serviceRejectedAt,
                serviceRejectedBy:
                    updatedTicket.serviceRejectedBy
            }
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to reject service",
            error: error.message
        });
    }
};

// ==========================================
// RATE TECHNICIAN
// ==========================================

const rateTechnician = async (req, res) => {
    try {
        const {
            rating,
            comment
        } = req.body;

        // ------------------------------------------
        // VALIDATE RATING
        // ------------------------------------------

        if (
            rating === undefined ||
            rating === null
        ) {
            return res.status(400).json({
                message:
                    "Rating is required"
            });
        }

        const numericRating =
            Number(rating);

        if (
            !Number.isInteger(
                numericRating
            ) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                message:
                    "Rating must be an integer between 1 and 5"
            });
        }

        // ------------------------------------------
        // FIND TICKET
        // ------------------------------------------

        const ticket =
            await Ticket.findById(
                req.params.id
            );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Ticket not found"
            });
        }

        // ------------------------------------------
        // ONLY CLOSED TICKETS
        // ------------------------------------------

        if (
            ticket.status !==
            "Closed"
        ) {
            return res.status(400).json({
                message:
                    "You can rate the technician only after the service is verified and the ticket is closed"
            });
        }

        // ------------------------------------------
        // ONLY TICKET CREATOR
        // ------------------------------------------

        if (
            ticket.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "Only the employee who created the ticket can rate the technician"
            });
        }

        // ------------------------------------------
        // CHECK TECHNICIAN
        // ------------------------------------------

        if (!ticket.assignedTo) {
            return res.status(400).json({
                message:
                    "No technician is assigned to this ticket"
            });
        }

        // ------------------------------------------
        // PREVENT DUPLICATE RATING
        // ------------------------------------------

        if (ticket.rating !== null) {
            return res.status(400).json({
                message:
                    "This ticket has already been rated"
            });
        }

        // ------------------------------------------
        // SAVE RATING
        // ------------------------------------------

        ticket.rating =
            numericRating;

        ticket.ratingComment =
            comment
                ? comment.trim()
                : "";

        ticket.ratedBy =
            req.user.userId;

        ticket.ratedAt =
            new Date();

        const updatedTicket =
            await ticket.save();

        // ==========================================
        // NOTIFY TECHNICIAN
        // ==========================================

        await createNotification({
            recipient:
                ticket.assignedTo,
            title:
                "New Technician Rating",
            message:
                `You received a ${numericRating}/5 rating for ticket "${ticket.title}".`,
            type:
                "RATING_SUBMITTED",
            relatedTicket:
                ticket._id
        });

        res.status(200).json({
            message:
                "Technician rated successfully",

            rating: {
                value:
                    updatedTicket.rating,

                comment:
                    updatedTicket.ratingComment,

                ratedBy:
                    updatedTicket.ratedBy,

                ratedAt:
                    updatedTicket.ratedAt
            }
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to rate technician",
            error: error.message
        });
    }
};

// ==========================================
// DELETE TICKET
// ==========================================

const deleteTicket = async (req, res) => {
    try {
        const ticket =
            await Ticket.findById(
                req.params.id
            );

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Ticket not found"
            });
        }

        await Ticket.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message:
                "Ticket deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to delete ticket",
            error: error.message
        });
    }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
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
};
