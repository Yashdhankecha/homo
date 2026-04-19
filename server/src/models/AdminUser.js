import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Dr. Kruti" },
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model("AdminUser", adminUserSchema);
