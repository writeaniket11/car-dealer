const express = require("express");
const nodemailer = require("nodemailer");
const Inquiry = require("../models/Inquiry");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function createTransporter() {
  if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST || "smtp.gmail.com",
    port: Number(process.env.NODEMAILER_PORT || 587),
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });
}

router.post("/", async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    const transporter = createTransporter();

    if (transporter && process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New car inquiry: ${inquiry.car_name || "General Inquiry"}`,
        html: `<p><strong>Name:</strong> ${inquiry.name}</p><p><strong>Phone:</strong> ${inquiry.phone}</p><p><strong>Email:</strong> ${inquiry.email || "-"}</p><p><strong>Car:</strong> ${inquiry.car_name || "-"}</p><p>${inquiry.message || ""}</p>`
      });
    }

    return res.status(201).json(inquiry);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to create inquiry" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = status ? { status } : {};
  const pageNumber = Math.max(Number(page), 1);
  const pageLimit = Math.min(Math.max(Number(limit), 1), 50);

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter).sort({ created_at: -1 }).skip((pageNumber - 1) * pageLimit).limit(pageLimit),
    Inquiry.countDocuments(filter)
  ]);

  return res.json({ inquiries, total, page: pageNumber, totalPages: Math.ceil(total / pageLimit) });
});

router.put("/:id", authMiddleware, async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
  return res.json(inquiry);
});

module.exports = router;
