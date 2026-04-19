import mongoose from "mongoose";

const messageLogSchema = new mongoose.Schema(
  {
    channel: { type: String, enum: ["whatsapp", "email"], required: true },
    patientName: { type: String, required: true },
    patientPhone: String,
    patientEmail: String,
    template: String,
    body: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MessageLog = mongoose.model("MessageLog", messageLogSchema);
