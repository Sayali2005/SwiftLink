import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173", // Vite local dev
  "https://swiftlink.web.app", // Firebase hosting
  "https://swiftlink-vvbf.onrender.com" // Render backend (self-calls)
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/", urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
