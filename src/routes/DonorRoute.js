import express from "express";
import {
  registerDonor,
  loginDonor,
  getDonorDashboard
} from "../controllers/DonorController.js";

const router = express.Router();

router.post("/register", registerDonor);
router.post("/login", loginDonor);
router.get("/dashboard/:donorId", getDonorDashboard);

export default router;