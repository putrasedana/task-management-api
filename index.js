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

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-production-domain.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api", authRoutes);

app.use("/api", taskRoutes);

app.use("/api", userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
