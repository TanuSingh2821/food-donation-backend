import Food from "../models/Food.js";
import NGO from "../models/ngoModel.js";
import { getDistance } from "../utils/distance.js";

import Notification from "../models/NotificationModel.js";


export const addFood = async (req, res) => {
  try {
    const { title, quantity, location, status, donorId, donorName } = req.body; // ← donorName add

    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;
    const { lat, lng } = parsedLocation;

    const food = new Food({
      title,
      quantity,
      location: parsedLocation,
      status,
      image: req.file ? req.file.filename : "",
      donatedBy: donorId || null
    });

    await food.save();

    // 🔥 find nearest NGOs
    const ngos = await NGO.find();
    const withDistance = ngos.map((ngo) => {
      const distance = getDistance(lat, lng, ngo.location.lat, ngo.location.lng);
      return { ...ngo._doc, distance };
    }).sort((a, b) => a.distance - b.distance);

    const top3 = withDistance.slice(0, 3);

    // 🔔 Save notification for each of top 3 NGOs
    const notifPromises = top3.map((ngo) =>
      new Notification({
        ngoId: ngo._id,
        foodId: food._id,
        message: `🍱 New food donated by ${donorName || "A donor"}: "${title}" (${quantity} portions)`
      }).save()
    );

    await Promise.all(notifPromises);

    console.log("Top NGOs notified:", top3.map(n => n.name));

    res.status(201).json({
      success: true,
      food,
      recommendedNGOs: top3
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📥 GET ALL AVAILABLE FOODS
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find({ status: "available" });

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


// 📍 GET NEARBY FOODS (DISTANCE BASED)
export const getNearbyFoods = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "lat and lng required"
      });
    }

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

    // sort by nearest
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


// ✅ CLAIM FOOD
// ✅ CLAIM FOOD
export const claimFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const { ngoId } = req.body; // ← ye add karo

    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      { status: "claimed", claimedBy: ngoId }, // ← claimedBy add karo
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    res.json({
      success: true,
      message: "Food claimed successfully",
      food: updatedFood
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
  