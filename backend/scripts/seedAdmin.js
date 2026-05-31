require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function seedAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await Admin.findOneAndUpdate(
    { email: process.env.ADMIN_EMAIL.toLowerCase() },
    { email: process.env.ADMIN_EMAIL.toLowerCase(), password },
    { upsert: true, new: true }
  );
  await mongoose.disconnect();
  console.log(`Admin ready: ${process.env.ADMIN_EMAIL}`);
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
