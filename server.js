import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js"; // ✅ import, not require
import dotenv from "dotenv";
dotenv.config(); // ✅ must come before using process.env


const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/", urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
