const Ticket = require("../models/Ticket");

const {
    createNotification
} = require("./notificationService");

const {
    getSlaStatus
} = require("../utils/sla");

// ==========================================
// CHECK SLA NOTIFICATIONS
// ==========================================

const checkSlaNotifications = async () => {

    try {

        // ==========================================
        // GET ACTIVE TICKETS
        // ==========================================

        const tickets = await Ticket.find({
            status: {
                $nin: [
                    "Resolved",
                    "Closed"
                ]
            },

            slaDueAt: {
                $ne: null
            },

            assignedTo: {
                $ne: null
            }
        });

        // ==========================================
        // CHECK EACH TICKET
        // ==========================================

        for (const ticket of tickets) {

            const slaStatus = getSlaStatus(
                ticket.slaDueAt,
                ticket.status
            );

            // ==========================================
            // SLA WARNING
            // ==========================================

            if (
                slaStatus === "Due Soon" &&
                ticket.slaWarningSent !== true
            ) {

                const notification =
                    await createNotification({
                        recipient:
                            ticket.assignedTo,

                        title:
                            "SLA Warning",

                        message:
                            `Ticket "${ticket.title}" is approaching its SLA deadline. Please take action soon.`,

                        type:
                            "SLA_WARNING",

                        relatedTicket:
                            ticket._id
                    });

                // Only mark as sent if notification
                // was successfully created

                if (notification) {

                    ticket.slaWarningSent = true;

                    await ticket.save();

                    console.log(
                        `SLA warning notification sent for ticket ${ticket._id}`
                    );
                }
            }

            // ==========================================
            // SLA BREACHED
            // ==========================================

            if (
                slaStatus === "Overdue" &&
                ticket.slaBreachSent !== true
            ) {

                const notification =
                    await createNotification({
                        recipient:
                            ticket.assignedTo,

                        title:
                            "SLA Breached",

                        message:
                            `Ticket "${ticket.title}" has breached its SLA deadline. Immediate action is required.`,

                        type:
                            "SLA_BREACHED",

                        relatedTicket:
                            ticket._id
                    });

                // Only mark as sent if notification
                // was successfully created

                if (notification) {

                    ticket.slaBreachSent = true;

                    await ticket.save();

                    console.log(
                        `SLA breach notification sent for ticket ${ticket._id}`
                    );
                }
            }
        }

    } catch (error) {

        console.error(
            "SLA notification checker failed:",
            error.message
        );
    }
};

// ==========================================
// START SLA MONITOR
// ==========================================

const startSlaNotificationService = () => {

    // Check immediately when the server starts

    checkSlaNotifications();

    // Check every 1 minute

    setInterval(
        checkSlaNotifications,
        60 * 1000
    );

    console.log(
        "SLA notification service started"
    );
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    checkSlaNotifications,
    startSlaNotificationService
};