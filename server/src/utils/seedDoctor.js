import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { AdminUser } from "../models/AdminUser.js";

async function run() {
  await connectDB();

  const email = process.env.DOCTOR_EMAIL;
  const password = process.env.DOCTOR_PASSWORD;
  if (!email || !password) throw new Error("DOCTOR_EMAIL/DOCTOR_PASSWORD missing in env");

  const passwordHash = await bcrypt.hash(password, 10);
  await AdminUser.findOneAndUpdate(
    { email },
    { email, passwordHash, name: "Dr. Kruti" },
    { upsert: true, new: true }
  );

  console.log("Doctor user seeded/updated");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
