import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { MessageLog } from "../models/MessageLog.js";

export const messageRouter = Router();

messageRouter.post("/log", requireAuth, async (req, res) => {
  const { channel, patientName, patientPhone, patientEmail, template, body } = req.body;
  if (!channel || !patientName || !body) return res.status(400).json({ message: "Missing fields" });

  const log = await MessageLog.create({ channel, patientName, patientPhone, patientEmail, template, body });
  res.status(201).json(log);
});

messageRouter.get("/log", requireAuth, async (_req, res) => {
  const logs = await MessageLog.find().sort({ createdAt: -1 }).limit(200);
  res.json(logs);
});
