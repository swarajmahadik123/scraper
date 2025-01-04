import express from "express";
import { exec } from "child_process";
import Trend from "../models/Trend.js";

const router = express.Router();

router.post("/scrape", async (req, res) => {
  try {
    exec("python3 scripts/scrape_twitter.py", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: "Failed to scrape data" });
      }
      const result = JSON.parse(stdout);
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

router.get("/trends", async (req, res) => {
  try {
    const trends = await Trend.find();
    res.status(200).json(trends);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

export default router;
