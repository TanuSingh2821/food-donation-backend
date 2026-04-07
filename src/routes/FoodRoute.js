import express from "express";
import {
  addFood,
  getFoods,
  claimFood,
  getNearbyFoods
} from "../controllers/FoodController.js";

import upload from "../middleware/upload.js"; // 🔥 IMPORTANT
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Add food (with image)
router.post("/add",authMiddleware, upload.single("image"), addFood);

// 📥 Get all food
router.get("/", getFoods);   // ✅ better route

// ✅ Claim food
router.put("/claim/:id",authMiddleware, claimFood);

// 📍 Nearby food (distance feature)
router.get("/nearby",authMiddleware, getNearbyFoods);

export default router;