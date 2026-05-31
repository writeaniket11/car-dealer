"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../utils/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("adminToken")) router.replace("/admin/dashboard");
  }, [router]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);
      localStorage.setItem("adminToken", res.data.token);
      toast.success("Logged in");
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials");
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-page grid min-h-[70vh] place-items-center py-12">
      <form onSubmit={submit} className="card grid w-full max-w-md gap-5 p-7">
        <div>
          <h1 className="text-3xl font-black">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to manage cars and inquiries.</p>
        </div>
        <label className="grid gap-2">
          <span className="label">Email</span>
          <input className="input" type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required />
        </label>
        <label className="grid gap-2">
          <span className="label">Password</span>
          <input className="input" type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} required />
        </label>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button className="btn-primary" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>
    </section>
  );
}
