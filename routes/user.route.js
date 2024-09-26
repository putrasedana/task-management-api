import express from "express";
import User from "../models/user.model.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User retrieved",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to retrieve user" });
  }
});

export default router;
