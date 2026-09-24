const express = require("express");

const {
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications
router.get("/", protect, getMyNotifications);

// Get unread notifications
router.get("/unread", protect, getUnreadNotifications);

// Mark one notification as read
router.put("/:id/read", protect, markAsRead);

// Mark all notifications as read
router.put("/read-all", protect, markAllAsRead);

module.exports = router;