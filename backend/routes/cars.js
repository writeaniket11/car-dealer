const express = require("express");
const multer = require("multer");
const path = require("path");
const Car = require("../models/Car");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    return cb(new Error("Only image files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

function toNumber(value) {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function buildCarPayload(body, files = []) {
  const payload = {
    name: body.name,
    brand: body.brand,
    model: body.model,
    year: toNumber(body.year),
    fuel_type: body.fuel_type,
    transmission: body.transmission,
    km_driven: toNumber(body.km_driven),
    engine_capacity: toNumber(body.engine_capacity),
    price: toNumber(body.price),
    description: body.description,
    location: body.location,
    owner_count: toNumber(body.owner_count),
    color: body.color,
    insurance_valid: body.insurance_valid === "true" || body.insurance_valid === true,
    is_featured: body.is_featured === "true" || body.is_featured === true
  };

  const existingImages = body.existingImages
    ? JSON.parse(body.existingImages)
    : Array.isArray(body.images)
      ? body.images
      : [];
  const uploadedImages = files.map((file) => `/uploads/${file.filename}`);
  payload.images = [...existingImages, ...uploadedImages];

  return payload;
}

router.get("/", async (req, res) => {
  try {
    const {
      brand,
      fuel_type,
      transmission,
      year_min,
      year_max,
      price_min,
      price_max,
      location,
      search,
      sort = "newest",
      page = 1,
      limit = 10
    } = req.query;

    const filter = { is_active: true };
    if (brand) filter.brand = new RegExp(brand, "i");
    if (fuel_type) filter.fuel_type = { $in: String(fuel_type).split(",") };
    if (transmission) filter.transmission = transmission;
    if (location) filter.location = new RegExp(location, "i");
    if (year_min || year_max) filter.year = {};
    if (year_min) filter.year.$gte = Number(year_min);
    if (year_max) filter.year.$lte = Number(year_max);
    if (price_min || price_max) filter.price = {};
    if (price_min) filter.price.$gte = Number(price_min);
    if (price_max) filter.price.$lte = Number(price_max);
    if (req.query.owner_count) filter.owner_count = { $in: String(req.query.owner_count).split(",").map(Number) };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        { model: new RegExp(search, "i") }
      ];
    }

    const sortMap = {
      newest: { created_at: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      km_asc: { km_driven: 1 }
    };

    const pageNumber = Math.max(Number(page), 1);
    const pageLimit = Math.min(Math.max(Number(limit), 1), 50);
    const [cars, total] = await Promise.all([
      Car.find(filter)
        .sort(sortMap[sort] || sortMap.newest)
        .skip((pageNumber - 1) * pageLimit)
        .limit(pageLimit),
      Car.countDocuments(filter)
    ]);

    return res.json({ cars, total, page: pageNumber, totalPages: Math.ceil(total / pageLimit) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch cars" });
  }
});

router.get("/featured", async (_req, res) => {
  const cars = await Car.find({ is_active: true, is_featured: true }).sort({ created_at: -1 }).limit(6);
  res.json(cars);
});

router.get("/:id", async (req, res) => {
  const car = await Car.findOne({ _id: req.params.id, is_active: true });
  if (!car) return res.status(404).json({ message: "Car not found" });
  return res.json(car);
});

router.post("/", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const car = await Car.create(buildCarPayload(req.body, req.files));
    return res.status(201).json(car);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to add car" });
  }
});

router.put("/:id", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, buildCarPayload(req.body, req.files), {
      new: true,
      runValidators: true
    });
    if (!car) return res.status(404).json({ message: "Car not found" });
    return res.json(car);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to update car" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
  if (!car) return res.status(404).json({ message: "Car not found" });
  return res.json({ message: "Car deleted", car });
});

router.patch("/:id/feature", authMiddleware, async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ message: "Car not found" });
  car.is_featured = !car.is_featured;
  await car.save();
  return res.json(car);
});

module.exports = router;
