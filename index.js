import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/task.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();

app.use(cors());

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
