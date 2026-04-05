import Donor from "../models/DonorModel.js";
import Food from "../models/Food.js";

// 📝 REGISTER DONOR
export const registerDonor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Donor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const donor = new Donor({ name, email, password });
    await donor.save();

    res.status(201).json({ success: true, message: "Donor registered successfully", donor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 LOGIN DONOR
export const loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const donor = await Donor.findOne({ email });
    if (!donor || donor.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ success: true, message: "Login successful", donor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 GET DONOR STATS + DONATIONS
export const getDonorDashboard = async (req, res) => {
  try {
    const { donorId } = req.params;

    const foods = await Food.find({ donatedBy: donorId });

    const totalDonations = foods.length;
    const totalPortions = foods.reduce((a, f) => a + Number(f.quantity || 0), 0);
    const claimed = foods.filter(f => f.status === "claimed").length;
    const available = foods.filter(f => f.status === "available").length;

    res.json({
      success: true,
      stats: { totalDonations, totalPortions, claimed, available },
      foods
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};