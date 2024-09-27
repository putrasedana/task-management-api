import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/task.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();

// CORS configuration to allow your frontend
const corsOptions = {
  origin: "https://task-management-app-virid.vercel.app", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", userRoutes);

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
