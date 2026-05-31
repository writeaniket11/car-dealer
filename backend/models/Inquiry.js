const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Phone must be 10 digits"]
  },
  email: { type: String, trim: true },
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  car_name: String,
  message: String,
  status: {
    type: String,
    enum: ["New", "Contacted", "Resolved"],
    default: "New"
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inquiry", inquirySchema);
