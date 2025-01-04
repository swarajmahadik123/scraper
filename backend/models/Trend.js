import mongoose from "mongoose";

const trendSchema = new mongoose.Schema({
  uniqueId: String,
  trend1: String,
  trend2: String,
  trend3: String,
  trend4: String,
  trend5: String,
  dateTime: String,
  ipAddress: String,
});

export default mongoose.model("Trend", trendSchema);
