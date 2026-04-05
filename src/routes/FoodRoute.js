import express from "express";
import {
  addFood,
  getFoods,
  claimFood,
  getNearbyFoods
} from "../controllers/FoodController.js";

import upload from "../middleware/upload.js"; // 🔥 IMPORTANT

const router = express.Router();

// ➕ Add food (with image)
router.post("/add", upload.single("image"), addFood);

// 📥 Get all food
router.get("/", getFoods);   // ✅ better route

// ✅ Claim food
router.put("/claim/:id", claimFood);

// 📍 Nearby food (distance feature)
router.get("/nearby", getNearbyFoods);

export default router;