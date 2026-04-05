import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    location: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },

    // 📸 Image
    image: {
      type: String,
      default: ""
    },

    // ✅ Status
    status: {
      type: String,
      enum: ["available", "claimed"],
      default: "available"
    },

    // 🏢 NGO जिसने claim किया
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      default: null
    },
     donatedBy: {                              // ← naya
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      default: null
    }
    
  },
  {
    timestamps: true // 🔥 createdAt, updatedAt automatically
  }
);

export default mongoose.model("Food", foodSchema);