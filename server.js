// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Allowed origins (add your frontend URLs here)
const allowedOrigins = [
  "http://localhost:5173",               // Local frontend dev
  "https://swiftlink.web.app",           // Your deployed Firebase hosting (old)
  "https://swiftlink-vvbf.onrender.com", // Your Render backend (self-calls)
  "https://swiftlink-2a685.web.app"      // Your new Firebase frontend URL
];

// CORS middleware config
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests (OPTIONS)
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middleware to parse JSON body
app.use(express.json());

// Log base URL to verify environment variable loading
console.log("BASE_URL loaded:", process.env.BASE_URL);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Use your URL routes
app.use("/", urlRoutes);

// Use Render's assigned port or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
