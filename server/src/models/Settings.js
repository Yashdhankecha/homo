import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    clinicName: { type: String, default: "Homoecare by Dr. Kruti Desai" },
    doctorName: { type: String, default: "Dr. Kruti Desai" },
    phone: { type: String, default: "+91 9081660475" },
    email: { type: String, default: "drkrutidesai752@gmail.com" },
    notificationsWhatsapp: { type: Boolean, default: true },
    notificationsEmail: { type: Boolean, default: true },
    feeNewCase: { type: String, default: "350" },
    feeOldCase: { type: String, default: "150" },
    medicineCharges: { type: String, default: "Medicine charges are extra (separate)" },
  },

  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
