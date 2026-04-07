import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // only import, no config here

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "feedhope",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export default multer({ storage });