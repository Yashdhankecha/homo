import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: Number,
    gender: String,
    phone: { type: String, required: true },
    email: String,
    mode: { type: String, enum: ["video", "whatsapp"], required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, enum: ["morning", "evening"], required: true },
    complaint: { type: String, required: true },
    source: String,
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
