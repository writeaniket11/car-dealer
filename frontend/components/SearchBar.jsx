"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const brands = ["", "Maruti Suzuki", "Hyundai", "Honda", "Tata", "Mahindra", "Toyota", "Kia", "Ford"];

export default function SearchBar() {
  const router = useRouter();
  const [values, setValues] = useState({ search: "", brand: "", price_max: "" });

  function submit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => value && params.set(key, value));
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg bg-white p-3 shadow-soft md:grid-cols-[1fr_180px_160px_auto]">
      <input className="input" placeholder="Search by car, brand, or model" value={values.search} onChange={(e) => setValues({ ...values, search: e.target.value })} />
      <select className="input" value={values.brand} onChange={(e) => setValues({ ...values, brand: e.target.value })}>
        {brands.map((brand) => (
          <option key={brand || "all"} value={brand}>{brand || "Any brand"}</option>
        ))}
      </select>
      <input className="input" type="number" placeholder="Max price" value={values.price_max} onChange={(e) => setValues({ ...values, price_max: e.target.value })} />
      <button className="btn-primary" type="submit">
        <Search size={18} /> Search Cars
      </button>
    </form>
  );
}
