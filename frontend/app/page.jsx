"use client";

import { BadgeCheck, CircleDollarSign, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../utils/api";
import CarGrid, { CarSkeletonGrid } from "../components/CarGrid";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cars/featured")
      .then((res) => setCars(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-[linear-gradient(120deg,#111827_0%,#374151_52%,#f97316_52%,#fb923c_100%)] text-white">
        <div className="container-page grid min-h-[560px] content-center gap-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black leading-tight md:text-6xl">Find your next verified second-hand car</h1>
            <p className="mt-5 max-w-2xl text-lg text-gray-100">Browse inspected cars, compare transparent prices, and talk directly with our dealer team before you visit.</p>
          </div>
          <SearchBar />
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Featured Cars</h2>
            <p className="mt-2 text-gray-600">Hand-picked stock ready for quick delivery.</p>
          </div>
          <Link href="/cars" className="hidden text-sm font-bold text-motor md:block">View all cars</Link>
        </div>
        {loading ? <CarSkeletonGrid /> : <CarGrid cars={cars} />}
      </section>

      <section className="bg-white py-14">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {[
            [ShieldCheck, "Verified Cars", "Every car is checked for documents, condition, and ownership history."],
            [CircleDollarSign, "Best Price", "Clear Indian pricing with no surprise dealer fees during inquiry."],
            [BadgeCheck, "Easy Finance", "Loan and exchange support to make the upgrade simpler."]
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-lg border border-gray-200 p-6">
              <Icon className="text-motor" size={30} />
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="rounded-lg bg-ink p-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Ready to compare all available cars?</h2>
            <p className="mt-2 text-gray-300">Use filters for price, fuel, transmission, year, city, and owner count.</p>
          </div>
          <Link href="/cars" className="btn-primary mt-6 bg-motor md:mt-0">Browse All Cars</Link>
        </div>
      </section>
    </>
  );
}
