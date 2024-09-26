import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already in use",
      });
    }

    const newUser = new User({
      id: uuidv4(), // Generate a unique ID
      name,
      email,
      password,
    });
    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "User Created",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "User registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "6h",
    });

    res.status(200).json({
      status: "success",
      message: "User logged successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Login failed" });
  }
});

export default router;
