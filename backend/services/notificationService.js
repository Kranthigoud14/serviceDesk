const Notification = require("../models/Notification");
const { getIO } = require("../socket");

const createNotification = async ({
  recipient,
  title,
  message,
  type = "GENERAL",
  relatedTicket = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      relatedTicket,
    });

    // Send real-time notification
    try {
      const io = getIO();

      io.to(`user_${recipient}`).emit("notification", notification);
    } catch (socketError) {
      console.error(
        "Socket notification failed:",
        socketError.message
      );
    }

    return notification;
  } catch (error) {
    console.error(
      "Notification creation failed:",
      error.message
    );

    return null;
  }
};

module.exports = {
  createNotification,
};