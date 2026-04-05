import express from "express";
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
router.get("/nearby/:ngoId", getNearbyFoodsForNGO);
router.get("/claimed/:ngoId", getClaimedFoods);
router.get("/:id", getNGOProfile);

export default router;