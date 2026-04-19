import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Settings } from "../models/Settings.js";

export const settingsRouter = Router();

settingsRouter.get("/", requireAuth, async (_req, res) => {
  const settings = await Settings.findOne();
  res.json(settings || {});
});

settingsRouter.put("/", requireAuth, async (req, res) => {
  const payload = req.body;
  const existing = await Settings.findOne();
  if (!existing) {
    const created = await Settings.create(payload);
    return res.json(created);
  }

  Object.assign(existing, payload);
  await existing.save();
  res.json(existing);
});
