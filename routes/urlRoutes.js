import express from "express";
import { nanoid } from "nanoid";
import Url from "../models/Url.js";

const router = express.Router();

// POST /api/shorten - create short URL
router.post("/api/shorten", async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: "URL required" });

    // Get BASE_URL from env; fallback to localhost with port
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    console.log("BASE_URL used:", baseUrl);

    const shortCode = nanoid(6);
    const shortUrl = `${baseUrl}/${shortCode}`;

    const newUrl = new Url({ longUrl, shortCode, shortUrl });
    await newUrl.save();

    return res.json({ shortUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/admin/urls - list all URLs
router.get("/api/admin/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });

    // Override shortUrl to always use current BASE_URL env
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const withFullShortUrl = urls.map(url => ({
      ...url.toObject(),
      shortUrl: `${baseUrl}/${url.shortCode}`
    }));

    res.json(withFullShortUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/admin/urls/:id - delete URL by ID
router.delete("/api/admin/urls/:id", async (req, res) => {
  try {
    const deletedUrl = await Url.findByIdAndDelete(req.params.id);
    if (!deletedUrl) return res.status(404).json({ error: "URL not found" });

    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:shortcode - redirect to original URL
router.get("/:shortcode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortcode });
    if (!url) return res.status(404).json({ error: "Not found" });

    url.clicks++;
    await url.save();

    return res.redirect(url.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
