"use client";

import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://car-dealer-chya.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function imageUrl(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${API_BASE_URL}${src}`;
}

export function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function formatKm(value) {
  return `${new Intl.NumberFormat("en-IN").format(Number(value || 0))} km`;
}

export default api;
