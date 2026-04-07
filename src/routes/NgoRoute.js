import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  registerNGO,
  loginNGO,
  getNearbyFoodsForNGO,
  getClaimedFoods,
  getNGOProfile
} from "../controllers/NgoController.js";

const router = express.Router();

router.post("/register", registerNGO);
router.post("/login", loginNGO);


router.get("/nearby/:ngoId", authMiddleware, getNearbyFoodsForNGO);
router.get("/claimed/:ngoId", authMiddleware, getClaimedFoods);
router.get("/:id", authMiddleware, getNGOProfile);

export default router;