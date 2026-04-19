import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.js";
import { appointmentRouter } from "./routes/appointments.js";
import { messageRouter } from "./routes/messages.js";
import { settingsRouter } from "./routes/settings.js";

const app = express();

// Flexible CORS configuration
app.use(cors({
  origin: true, // This allows all origins for easier initial deployment. 
  // You can restrict this later by specifying your Netlify URL
  credentials: true
}));

app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/ping", (_req, res) => res.send("alive"));
app.use("/api/auth", authRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/messages", messageRouter);
app.use("/api/settings", settingsRouter);

const port = Number(process.env.PORT || 5000);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect DB", error);
    process.exit(1);
  });
