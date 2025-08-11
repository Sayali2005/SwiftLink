import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true }, // <-- Add this
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Url", urlSchema);
