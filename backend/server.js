import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/api.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

// Connect to the database
connectDB();

// CORS Configuration to allow all origins
const corsOptions = {
  origin: "*", // Allow requests from any origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: false, // Disable credentials (cookies, authorization headers)
  optionsSuccessStatus: 204, // Respond with 204 No Content for preflight requests
};

// Middleware
app.use(cors(corsOptions)); // Use the CORS configuration
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
