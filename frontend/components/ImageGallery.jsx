"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { imageUrl } from "../utils/api";

const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='600'%3E%3Crect width='900' height='600' fill='%23e5e7eb'/%3E%3Ctext x='450' y='305' text-anchor='middle' font-family='Arial' font-size='34' fill='%236b7280'%3ECar image%3C/text%3E%3C/svg%3E";

export default function ImageGallery({ images = [] }) {
  const safeImages = images.length ? images : [fallback];
  const [index, setIndex] = useState(0);
  const current = imageUrl(safeImages[index]) || fallback;

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-200">
        <img src={current} alt="Car" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = fallback; }} />
        <button className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90" onClick={() => setIndex((index - 1 + safeImages.length) % safeImages.length)} aria-label="Previous image">
          <ChevronLeft />
        </button>
        <button className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90" onClick={() => setIndex((index + 1) % safeImages.length)} aria-label="Next image">
          <ChevronRight />
        </button>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto">
        {safeImages.map((image, thumbIndex) => (
          <button key={`${image}-${thumbIndex}`} onClick={() => setIndex(thumbIndex)} className={`h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 ${thumbIndex === index ? "border-motor" : "border-transparent"}`}>
            <img src={imageUrl(image) || fallback} alt="Car thumbnail" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
