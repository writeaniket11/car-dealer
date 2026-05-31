"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { imageUrl } from "../utils/api";

const emptyCar = {
  brand: "",
  name: "",
  model: "",
  year: "",
  fuel_type: "Petrol",
  transmission: "Manual",
  km_driven: "",
  engine_capacity: "",
  price: "",
  owner_count: "1",
  color: "",
  location: "",
  insurance_valid: false,
  description: "",
  is_featured: false,
  images: []
};

export default function CarForm({ car, onSaved, onCancel }) {
  const [values, setValues] = useState(emptyCar);
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (car) {
      setValues({ ...emptyCar, ...car });
      setExistingImages(car.images || []);
    }
  }, [car]);

  function setField(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const required = ["brand", "name", "model", "year", "fuel_type", "transmission", "km_driven", "price", "location"];
    const next = {};
    required.forEach((key) => {
      if (!String(values[key] || "").trim()) next[key] = "Required";
    });
    return next;
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "images" && value !== undefined && value !== null) formData.append(key, value);
    });
    formData.append("existingImages", JSON.stringify(existingImages));
    files.forEach((file) => formData.append("images", file));

    setLoading(true);
    try {
      if (car?._id) {
        await api.put(`/cars/${car._id}`, formData);
        toast.success("Car updated");
      } else {
        await api.post("/cars", formData);
        toast.success("Car added");
      }
      onSaved?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save car");
    } finally {
      setLoading(false);
    }
  }

  const previews = files.map((file) => ({ name: file.name, src: URL.createObjectURL(file), file }));

  return (
    <form onSubmit={submit} className="grid max-h-[85vh] gap-4 overflow-y-auto p-1">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["brand", "Brand"],
          ["name", "Name"],
          ["model", "Model"],
          ["year", "Year"],
          ["km_driven", "KM Driven"],
          ["engine_capacity", "Engine CC"],
          ["price", "Price"],
          ["owner_count", "Owner Count"],
          ["color", "Color"],
          ["location", "Location"]
        ].map(([key, label]) => (
          <label key={key} className="grid gap-2">
            <span className="label">{label}</span>
            <input className={`input ${errors[key] ? "border-red-500" : ""}`} value={values[key] || ""} onChange={(e) => setField(key, e.target.value)} />
            {errors[key] && <span className="text-xs text-red-600">{errors[key]}</span>}
          </label>
        ))}
        <label className="grid gap-2">
          <span className="label">Fuel Type</span>
          <select className="input" value={values.fuel_type} onChange={(e) => setField("fuel_type", e.target.value)}>
            {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="label">Transmission</span>
          <select className="input" value={values.transmission} onChange={(e) => setField("transmission", e.target.value)}>
            {["Manual", "Automatic"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="label">Description</span>
        <textarea className="input min-h-28" value={values.description || ""} onChange={(e) => setField("description", e.target.value)} />
      </label>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={Boolean(values.insurance_valid)} onChange={(e) => setField("insurance_valid", e.target.checked)} /> Insurance Valid
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={Boolean(values.is_featured)} onChange={(e) => setField("is_featured", e.target.checked)} /> Featured
        </label>
      </div>

      <label className="grid gap-2">
        <span className="label">Images</span>
        <input className="input" type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
      </label>

      <div className="flex flex-wrap gap-3">
        {existingImages.map((src) => (
          <div key={src} className="relative h-20 w-24 overflow-hidden rounded-md bg-gray-100">
            <img src={imageUrl(src)} alt="Existing car" className="h-full w-full object-cover" />
            <button type="button" className="absolute right-1 top-1 rounded-full bg-white p-1" onClick={() => setExistingImages(existingImages.filter((item) => item !== src))} aria-label="Remove image">
              <X size={14} />
            </button>
          </div>
        ))}
        {previews.map((preview) => (
          <div key={preview.name} className="relative h-20 w-24 overflow-hidden rounded-md bg-gray-100">
            <img src={preview.src} alt="New car" className="h-full w-full object-cover" />
            <button type="button" className="absolute right-1 top-1 rounded-full bg-white p-1" onClick={() => setFiles(files.filter((file) => file !== preview.file))} aria-label="Remove image">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : car?._id ? "Update Car" : "Add Car"}</button>
      </div>
    </form>
  );
}
