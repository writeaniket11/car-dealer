"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { formatKm, formatPrice, imageUrl } from "../utils/api";

const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='420' viewBox='0 0 640 420'%3E%3Crect width='640' height='420' fill='%23e5e7eb'/%3E%3Cpath d='M140 250h360l-35-80H190l-50 80Z' fill='%239ca3af'/%3E%3Ccircle cx='220' cy='270' r='34' fill='%23374151'/%3E%3Ccircle cx='440' cy='270' r='34' fill='%23374151'/%3E%3Ctext x='320' y='135' text-anchor='middle' font-family='Arial' font-size='28' fill='%236b7280'%3ECar image%3C/text%3E%3C/svg%3E";

export default function CarCard({ car }) {
  return (
    <article className="card overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-200">
        <img
          src={imageUrl(car.images?.[0]) || fallback}
          alt={car.name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = fallback;
          }}
        />
        <span className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-xs font-bold text-ink">{car.fuel_type}</span>
        {car.is_featured && (
          <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-motor text-white">
            <Star size={16} fill="currentColor" />
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-black text-ink">{car.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{car.model}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
          <span>{car.year}</span>
          <span>|</span>
          <span>{formatKm(car.km_driven)}</span>
          <span>|</span>
          <span>{car.transmission}</span>
        </div>
        <div className="mt-4 text-2xl font-black text-ink">{formatPrice(car.price)}</div>
        <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={15} /> {car.location || "Location on request"}
        </div>
        <Link href={`/cars/${car._id}`} className="btn-primary mt-5 w-full">
          View Details
        </Link>
      </div>
    </article>
  );
}
