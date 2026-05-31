"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import CarGrid, { CarSkeletonGrid } from "./CarGrid";
import FilterSidebar from "./FilterSidebar";

export default function CarsListingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const [filters, setFilters] = useState({ page: 1, limit: 10, sort: "newest", ...initialFilters });
  const [data, setData] = useState({ cars: [], total: 0, page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    router.replace(`/cars?${params.toString()}`, { scroll: false });
    setLoading(true);
    api.get(`/cars?${params.toString()}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [filters, router]);

  function clearFilters() {
    setFilters({ page: 1, limit: 10, sort: "newest" });
  }

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-black">{data.total} Cars Found</h1>
        <select className="input max-w-xs" value={filters.sort || "newest"} onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price Low to High</option>
          <option value="price_desc">Price High to Low</option>
          <option value="km_asc">KM Low to High</option>
        </select>
      </div>

      <div className="grid gap-7 lg:grid-cols-[290px_1fr]">
        <FilterSidebar filters={filters} setFilters={setFilters} clearFilters={clearFilters} />
        <div>
          {loading ? (
            <CarSkeletonGrid count={4} />
          ) : data.cars.length ? (
            <CarGrid cars={data.cars} columns="lg:grid-cols-2" />
          ) : (
            <div className="card grid min-h-80 place-items-center p-8 text-center">
              <div>
                <h2 className="text-2xl font-black">No cars found</h2>
                <p className="mt-2 text-gray-600">Try adjusting price, year, fuel, or location filters.</p>
                <button className="btn-primary mt-5" onClick={clearFilters}>Clear filters</button>
              </div>
            </div>
          )}

          {data.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: data.totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <button key={page} className={`h-10 w-10 rounded-md border ${Number(filters.page) === page ? "bg-ink text-white" : "bg-white"}`} onClick={() => setFilters({ ...filters, page })}>
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
