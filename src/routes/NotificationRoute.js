import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from "../controllers/NotificationController.js";

const router = express.Router();

router.get("/:ngoId", getNotifications);
router.put("/:id/read", markAsRead);
router.put("/readall/:ngoId", markAllAsRead);

export default router;