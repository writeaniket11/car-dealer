import { Suspense } from "react";
import CarsListingClient from "../../components/CarsListingClient";

export const metadata = {
  title: "Used Cars",
  description: "Search verified second-hand cars by brand, price, fuel type, transmission, city, year, and owner count."
};

export default function CarsPage() {
  return (
    <section className="container-page py-10">
      <Suspense fallback={<div className="skeleton h-96" />}>
        <CarsListingClient />
      </Suspense>
    </section>
  );
}
