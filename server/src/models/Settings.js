import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    clinicName: { type: String, default: "Homoecare by Dr. Kruti Desai" },
    doctorName: { type: String, default: "Dr. Kruti Desai" },
    phone: { type: String, default: "+91 9081660475" },
    email: { type: String, default: "krutidesai752@gmail.com" },
    clinicAddress: { type: String, default: "Anand, Gujarat, India" },
    notificationsWhatsapp: { type: Boolean, default: true },
    notificationsEmail: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
