"use client";

import CarCard from "./CarCard";

export function CarSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card overflow-hidden p-4">
          <div className="skeleton aspect-[4/3]" />
          <div className="skeleton mt-4 h-5 w-3/4" />
          <div className="skeleton mt-3 h-4 w-1/2" />
          <div className="skeleton mt-5 h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function CarGrid({ cars = [], columns = "lg:grid-cols-3" }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${columns}`}>
      {cars.map((car) => (
        <CarCard key={car._id} car={car} />
      ))}
    </div>
  );
}
