"use client";

const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const brands = ["", "Maruti Suzuki", "Hyundai", "Honda", "Tata", "Mahindra", "Toyota", "Kia", "Ford"];

export default function FilterSidebar({ filters, setFilters, clearFilters }) {
  const fuel = filters.fuel_type ? filters.fuel_type.split(",") : [];
  const owners = filters.owner_count ? filters.owner_count.split(",") : [];

  function toggleList(key, value, current) {
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    setFilters({ ...filters, [key]: next.join(","), page: 1 });
  }

  return (
    <aside className="card h-fit p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black">Filters</h2>
        <button onClick={clearFilters} className="text-sm font-semibold text-motor">Clear</button>
      </div>

      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="label">Brand</span>
          <select className="input" value={filters.brand || ""} onChange={(e) => setFilters({ ...filters, brand: e.target.value, page: 1 })}>
            {brands.map((brand) => <option key={brand || "all"} value={brand}>{brand || "All brands"}</option>)}
          </select>
        </label>

        <div>
          <span className="label">Fuel Type</span>
          <div className="mt-2 grid gap-2">
            {fuelTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={fuel.includes(type)} onChange={() => toggleList("fuel_type", type, fuel)} /> {type}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="label">Transmission</span>
          <div className="mt-2 flex gap-4 text-sm">
            {["Manual", "Automatic"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input type="radio" name="transmission" checked={filters.transmission === type} onChange={() => setFilters({ ...filters, transmission: type, page: 1 })} /> {type}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2">
            <span className="label">Min Price</span>
            <input className="input" type="number" min="0" max="5000000" value={filters.price_min || ""} onChange={(e) => setFilters({ ...filters, price_min: e.target.value, page: 1 })} />
          </label>
          <label className="grid gap-2">
            <span className="label">Max Price</span>
            <input className="input" type="number" min="0" max="5000000" value={filters.price_max || ""} onChange={(e) => setFilters({ ...filters, price_max: e.target.value, page: 1 })} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2">
            <span className="label">Min Year</span>
            <input className="input" type="number" value={filters.year_min || ""} onChange={(e) => setFilters({ ...filters, year_min: e.target.value, page: 1 })} />
          </label>
          <label className="grid gap-2">
            <span className="label">Max Year</span>
            <input className="input" type="number" value={filters.year_max || ""} onChange={(e) => setFilters({ ...filters, year_max: e.target.value, page: 1 })} />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="label">Location</span>
          <input className="input" value={filters.location || ""} onChange={(e) => setFilters({ ...filters, location: e.target.value, page: 1 })} placeholder="City name" />
        </label>

        <div>
          <span className="label">Owner Count</span>
          <div className="mt-2 flex gap-4 text-sm">
            {["1", "2", "3"].map((owner) => (
              <label key={owner} className="flex items-center gap-2">
                <input type="checkbox" checked={owners.includes(owner)} onChange={() => toggleList("owner_count", owner, owners)} /> {owner}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
