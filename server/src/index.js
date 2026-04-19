import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import { AdminUser } from "./models/AdminUser.js";
import { authRouter } from "./routes/auth.js";
import { appointmentRouter } from "./routes/appointments.js";
import { messageRouter } from "./routes/messages.js";
import { settingsRouter } from "./routes/settings.js";

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true, timestamp: new Date() }));
app.get("/api/ping", (_req, res) => res.send("alive - server is responsive"));

app.use("/api/auth", authRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/messages", messageRouter);
app.use("/api/settings", settingsRouter);

async function autoSeed() {
  const count = await AdminUser.countDocuments();
  if (count === 0) {
    const email = process.env.DOCTOR_EMAIL || "admin@homo.com";
    const password = process.env.DOCTOR_PASSWORD || "1234qwer";
    const passwordHash = await bcrypt.hash(password, 10);
    await AdminUser.create({ email, passwordHash, name: "Dr. Kruti" });
    console.log("🚀 Initial Admin User created automatically!");
  }
}

const port = Number(process.env.PORT || 5000);

connectDB()
  .then(async () => {
    console.log("✅ MongoDB connected successfully");
    await autoSeed();
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect DB or Seed", error);
    process.exit(1);
  });
