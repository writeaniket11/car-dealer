"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api, { formatKm, formatPrice } from "../../../utils/api";
import ImageGallery from "../../../components/ImageGallery";
import InquiryForm from "../../../components/InquiryForm";
import WhatsAppButton from "../../../components/WhatsAppButton";
import CarGrid from "../../../components/CarGrid";

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then((res) => {
        setCar(res.data);
        return api.get(`/cars?brand=${encodeURIComponent(res.data.brand)}&limit=3`);
      })
      .then((res) => setSimilar(res.data.cars.filter((item) => item._id !== id).slice(0, 3)))
      .catch(() => setCar(false))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container-page py-12"><div className="skeleton h-96" /></div>;
  if (car === false) {
    return (
      <section className="container-page grid min-h-[60vh] place-items-center py-12 text-center">
        <div>
          <h1 className="text-4xl font-black">Car not found</h1>
          <p className="mt-3 text-gray-600">This car may have been sold or removed from the listing.</p>
          <Link href="/cars" className="btn-primary mt-6">Browse available cars</Link>
        </div>
      </section>
    );
  }

  const specs = [
    ["Brand", car.brand],
    ["Model", car.model],
    ["Year", car.year],
    ["Fuel Type", car.fuel_type],
    ["Transmission", car.transmission],
    ["KM Driven", formatKm(car.km_driven)],
    ["Engine CC", car.engine_capacity || "-"],
    ["Owner Count", car.owner_count || "-"],
    ["Color", car.color || "-"],
    ["Location", car.location || "-"],
    ["Insurance Valid", car.insurance_valid ? "Yes" : "No"]
  ];

  return (
    <section className="container-page py-10">
      <div className="grid gap-9 lg:grid-cols-[1.15fr_0.85fr]">
        <ImageGallery images={car.images} />
        <div>
          <p className="font-bold text-motor">{car.year}</p>
          <h1 className="mt-2 text-4xl font-black">{car.name}</h1>
          <div className="mt-5 text-4xl font-black text-ink">{formatPrice(car.price)}</div>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {specs.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs font-bold uppercase text-gray-500">{label}</p>
                <p className="mt-1 font-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <WhatsAppButton phoneNumber={phone} carName={car.name} price={car.price} />
            <button className="btn-primary" onClick={() => setShowInquiry(!showInquiry)}>Send Inquiry</button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="card p-6">
          <h2 className="text-2xl font-black">Description</h2>
          <p className="mt-3 leading-7 text-gray-700">{car.description || "Contact our team for service history, inspection details, and finance options."}</p>
        </div>
        {showInquiry && <InquiryForm carId={car._id} carName={car.name} />}
      </div>

      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 text-2xl font-black">You may also like</h2>
          <CarGrid cars={similar} />
        </div>
      )}
    </section>
  );
}
