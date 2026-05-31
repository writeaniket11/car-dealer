require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const bcrypt = require("bcryptjs");

const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");
const inquiryRoutes = require("./routes/inquiries");
const Admin = require("./models/Admin");

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "second-hand-car-dealer-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.use((error, _req, res, _next) => {
  res.status(500).json({ message: error.message || "Server error" });
});

async function ensureDefaultAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;

  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await Admin.findOneAndUpdate(
    { email },
    { email, password },
    { upsert: true, runValidators: true }
  );
  console.log(`Admin account ready: ${email}`);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    await ensureDefaultAdmin();
    app.listen(port, () => console.log(`API running on port ${port}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  });
