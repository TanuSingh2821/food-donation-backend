//import NGO from "../models/ngoModel.js";
import Food from "../models/Food.js";
import { getDistance } from "../utils/distance.js";
import NGO from "../models/ngoModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// 🏢 REGISTER NGO
export const registerNGO = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    const existing = await NGO.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    // 🔥 HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const ngo = new NGO({
      name,
      email,
      password: hashedPassword,
      location: parsedLocation
    });

    await ngo.save();

    res.status(201).json({
      success: true,
      message: "NGO registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// 🔐 LOGIN NGO

export const loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check if NGO exists
    const ngo = await NGO.findOne({ email });
    if (!ngo) {
      return res.status(401).json({
        success: false,
        message: "NGO not found"
      });
    }

    // 🔐 Compare hashed password
    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // 🎟️ Generate JWT token
    const token = jwt.sign(
      { id: ngo._id, role: "ngo" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Send response (NO password)
    res.status(200).json({
      success: true,
      token,
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        location: ngo.location
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 📍 GET NEARBY FOODS FOR NGO
export const getNearbyFoodsForNGO = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const ngo = await NGO.findById(ngoId);

    if (!ngo) {
      return res.status(404).json({
        message: "NGO not found"
      });
    }

    const { lat, lng } = ngo.location;

    const foods = await Food.find({ status: "available" });

    const nearbyFoods = foods.map((food) => {
      const distance = getDistance(
        lat,
        lng,
        food.location.lat,
        food.location.lng
      );

      return { ...food._doc, distance };
    });

    // sort nearest first
    nearbyFoods.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      count: nearbyFoods.length,
      foods: nearbyFoods
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// 📦 GET CLAIMED FOODS BY NGO
export const getClaimedFoods = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const foods = await Food.find({
      claimedBy: ngoId
    });

    res.json({
      success: true,
      count: foods.length,
      foods
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// 👤 GET NGO PROFILE
export const getNGOProfile = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        message: "NGO not found"
      });
    }

    res.json({
      success: true,
      ngo
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};