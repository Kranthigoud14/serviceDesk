const Notification = require("../models/Notification");

// ==========================================
// GET NOTIFICATIONS FOR LOGGED-IN USER
// ==========================================

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .populate("relatedTicket");

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// ==========================================
// GET UNREAD NOTIFICATIONS
// ==========================================

const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .populate("relatedTicket");

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread notifications",
      error: error.message,
    });
  }
};

// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user.userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
};