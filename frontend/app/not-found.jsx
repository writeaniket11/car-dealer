import Link from "next/link";

export default function NotFound() {
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
