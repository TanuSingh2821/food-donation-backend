import Donor from "../models/DonorModel.js";
import Food from "../models/Food.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// 📝 REGISTER DONOR
export const registerDonor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Donor.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // 🔥 HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const donor = new Donor({
      name,
      email,
      password: hashedPassword
    });

    await donor.save();

    res.status(201).json({
      success: true,
      message: "Donor registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 🔐 LOGIN DONOR


export const loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // 🔥 bcrypt compare
    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // 🔥 JWT TOKEN
    const token = jwt.sign(
      { id: donor._id, role: "donor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email
      }
    });

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