import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  location: {
    lat: Number,
    lng: Number
  }
});

export default mongoose.model("NGO", ngoSchema);