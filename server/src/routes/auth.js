import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminUser } from "../models/AdminUser.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase().substring(0, 100);
  const password = req.body.password?.substring(0, 100);

  if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

  const admin = await AdminUser.findOne({ email: email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ sub: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});
