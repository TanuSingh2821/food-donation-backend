import Notification from "../models/NotificationModel.js";

// 🔔 GET ALL NOTIFICATIONS FOR NGO
export const getNotifications = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const notifications = await Notification.find({ ngoId })
      .populate("foodId", "title quantity")
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      unreadCount,
      notifications
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ MARK ONE AS READ
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, { isRead: true });

    res.json({ success: true, message: "Marked as read" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ MARK ALL AS READ
export const markAllAsRead = async (req, res) => {
  try {
    const { ngoId } = req.params;

    await Notification.updateMany({ ngoId, isRead: false }, { isRead: true });

    res.json({ success: true, message: "All marked as read" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};