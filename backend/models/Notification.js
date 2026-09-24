const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "TICKET_ASSIGNED",
        "TICKET_UPDATED",
        "TICKET_RESOLVED",
        "VERIFICATION_REQUESTED",
        "VERIFICATION_COMPLETED",
        "SLA_WARNING",
        "SLA_BREACHED",
        "RATING_SUBMITTED",
        "GENERAL",
      ],
      default: "GENERAL",
    },

    relatedTicket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);