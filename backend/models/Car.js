const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  fuel_type: {
    type: String,
    enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
    required: true
  },
  transmission: {
    type: String,
    enum: ["Manual", "Automatic"],
    required: true
  },
  km_driven: { type: Number, required: true },
  engine_capacity: Number,
  price: { type: Number, required: true },
  images: [{ type: String }],
  description: String,
  location: String,
  owner_count: Number,
  color: String,
  insurance_valid: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  is_featured: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Car", carSchema);
