import express from "express";
import cors from "cors";
import donorRoutes from "./routes/DonorRoute.js";
import foodroutes from "./routes/FoodRoute.js";
import ngoRoutes from "./routes/NgoRoute.js";
import notificationRoutes from "./routes/NotificationRoute.js";

const app = express();

// middlewares
app.use(cors({
  origin: "*",
}));
app.use(express.json());

// 🔥 serve uploaded images
app.use("/uploads", express.static("uploads"));

// test routes
app.get("/", (req, res) => {
  res.send("Main API working 🚀");
});

app.get("/home", (req, res) => {
  res.send("API home page");
});

// main routes
app.use("/api/food", foodroutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/donor", donorRoutes); 


app.use("/api/notifications", notificationRoutes);
export default app;