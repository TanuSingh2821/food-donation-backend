import NGO from "../models/ngoModel.js";
import Food from "../models/Food.js";
import { getDistance } from "../utils/distance.js";


// 🏢 REGISTER NGO
export const registerNGO = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    const ngo = new NGO({
      name,
      email,
      password,
      location: parsedLocation
    });

    await ngo.save();

    res.status(201).json({
      success: true,
      message: "NGO registered successfully",
      ngo
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// 🔐 LOGIN NGO (basic)
export const loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ngo = await NGO.findOne({ email });

    if (!ngo || ngo.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      ngo
    });

  } catch (error) {
    res.status(500).json({
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