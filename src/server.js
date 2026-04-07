import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST LINE

import app from "./app.js";
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js"; 

connectDB();
connectCloudinary(); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});