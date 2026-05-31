"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function InquiryForm({ carId, carName = "General Inquiry" }) {
  const [values, setValues] = useState({ name: "", phone: "", email: "", message: "", car_name: carName });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = "Full name is required";
    if (!/^[0-9]{10}$/.test(values.phone)) next.phone = "Enter a valid 10-digit phone number";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email";
    return next;
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSuccess("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await api.post("/inquiries", { ...values, car_id: carId, car_name: carName });
      setSuccess("Thank you! Our team will contact you shortly.");
      toast.success("Inquiry sent");
      setValues({ name: "", phone: "", email: "", message: "", car_name: carName });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not submit inquiry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card grid gap-4 p-5">
      <div className="grid gap-2">
        <label className="label">Full Name</label>
        <input className="input" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
      </div>
      <div className="grid gap-2">
        <label className="label">Phone</label>
        <input className="input" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
        {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
      </div>
      <div className="grid gap-2">
        <label className="label">Email</label>
        <input className="input" type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
      </div>
      <div className="grid gap-2">
        <label className="label">Car Name</label>
        <input className="input" value={carName} disabled />
      </div>
      <div className="grid gap-2">
        <label className="label">Message</label>
        <textarea className="input min-h-28" value={values.message} onChange={(e) => setValues({ ...values, message: e.target.value })} />
      </div>
      <button className="btn-primary" disabled={loading}>{loading ? "Sending..." : "Send Inquiry"}</button>
      {success && <p className="rounded-md bg-green-50 p-3 text-sm font-semibold text-green-700">{success}</p>}
    </form>
  );
}
