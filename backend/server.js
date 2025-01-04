import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import scrapeRoutes from "./routes/scrapeRoutes.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/twitterTrends", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/api", scrapeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
