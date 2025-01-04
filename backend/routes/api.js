import express from "express";
import { scrapeTrends } from "../controllers/scraperController.js";

const router = express.Router();

router.post("/scrape", scrapeTrends);

export default router;