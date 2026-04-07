import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";


import {
  registerDonor,
  loginDonor,
  getDonorDashboard
} from "../controllers/DonorController.js";

const router = express.Router();

router.post("/register", registerDonor);
router.post("/login", loginDonor);
router.get("/dashboard/:donorId", authMiddleware, getDonorDashboard);

export default router;