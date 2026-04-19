import { Router } from "express";
import { Appointment } from "../models/Appointment.js";
import { requireAuth } from "../middleware/auth.js";
import { sendAppointmentEmail } from "../utils/mailer.js";

export const appointmentRouter = Router();

appointmentRouter.post("/", async (req, res) => {
  const { name, age, gender, phone, email, mode, preferredDate, preferredTime, complaint, source } = req.body;

  if (!name || !phone || !mode || !preferredDate || !preferredTime || !complaint) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Server-side validation for phone (exactly 10 digits)
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
  }

  try {
    const created = await Appointment.create({
      name: name.trim().substring(0, 100),
      age: age || null,
      gender: gender || "Other",
      phone: phone,
      email: email?.trim().toLowerCase(),
      mode: mode,
      preferredDate: preferredDate,
      preferredTime: preferredTime,
      complaint: complaint.trim().substring(0, 2000),
      source: source?.trim().substring(0, 100),
    });

    // Async send email
    await sendAppointmentEmail(created, "applied");

    res.status(201).json(created);
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

appointmentRouter.get("/", requireAuth, async (_req, res) => {
  const list = await Appointment.find().sort({ createdAt: -1 });
  res.json(list);
});

appointmentRouter.get("/stats", requireAuth, async (_req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [appointmentsThisMonth, pendingConfirmations, totalPatients] = await Promise.all([
    Appointment.countDocuments({ preferredDate: { $gte: monthStart, $lt: nextMonthStart } }),
    Appointment.countDocuments({ status: "pending" }),
    Appointment.distinct("phone").then((phones) => phones.length),
  ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  const todaysAppointments = await Appointment.countDocuments({
    preferredDate: { $gte: todayStart, $lt: tomorrowStart },
  });

  res.json({
    appointmentsThisMonth,
    pendingConfirmations,
    todaysAppointments,
    totalPatients,
  });
});

appointmentRouter.get("/today", requireAuth, async (_req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  const list = await Appointment.find({
    preferredDate: { $gte: todayStart, $lt: tomorrowStart },
  }).sort({ preferredTime: 1, createdAt: -1 });

  res.json(list);
});

appointmentRouter.patch("/:id/status", requireAuth, async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "confirmed", "completed", "cancelled", "rejected"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const updated = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!updated) return res.status(404).json({ message: "Appointment not found" });

  // Handle email notifications based on status
  if (status === "confirmed") sendAppointmentEmail(updated, "confirmed");
  if (status === "completed") sendAppointmentEmail(updated, "completed");
  if (status === "rejected") sendAppointmentEmail(updated, "rejected");

  res.json(updated);
});
