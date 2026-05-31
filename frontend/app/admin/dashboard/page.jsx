"use client";

import { LogOut, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CarForm from "../../../components/CarForm";
import api, { formatPrice, imageUrl } from "../../../utils/api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState("cars");
  const [carsData, setCarsData] = useState({ cars: [], total: 0 });
  const [inquiryData, setInquiryData] = useState({ inquiries: [], total: 0 });
  const [status, setStatus] = useState("");
  const [modalCar, setModalCar] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(() => {
    const active = carsData.cars.filter((car) => car.is_active !== false).length;
    const fresh = inquiryData.inquiries.filter((inquiry) => inquiry.status === "New").length;
    return [
      ["Total Cars", carsData.total],
      ["Active Cars", active],
      ["Total Inquiries", inquiryData.total],
      ["New Inquiries", fresh]
    ];
  }, [carsData, inquiryData]);

  async function load() {
    setLoading(true);
    try {
      const [cars, inquiries] = await Promise.all([
        api.get("/cars?limit=50"),
        api.get(`/inquiries?limit=50${status ? `&status=${status}` : ""}`)
      ]);
      setCarsData(cars.data);
      setInquiryData(inquiries.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        router.replace("/admin/login");
      } else {
        toast.error("Could not load dashboard");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      router.replace("/admin/login");
      return;
    }
    load();
  }, [router, status]);

  function logout() {
    localStorage.removeItem("adminToken");
    router.replace("/admin/login");
  }

  async function deleteCar(id) {
    if (!confirm("Delete this car?")) return;
    await api.delete(`/cars/${id}`);
    toast.success("Car deleted");
    load();
  }

  async function toggleFeature(id) {
    await api.patch(`/cars/${id}/feature`);
    toast.success("Featured status updated");
    load();
  }

  async function markInquiry(id, nextStatus) {
    await api.put(`/inquiries/${id}`, { status: nextStatus });
    toast.success("Inquiry updated");
    load();
  }

  return (
    <section className="container-page py-8">
      <div className="grid gap-7 lg:grid-cols-[240px_1fr]">
        <aside className="card h-fit p-4">
          <h1 className="px-2 text-xl font-black">Admin</h1>
          <div className="mt-6 grid gap-2">
            {["cars", "inquiries"].map((item) => (
              <button key={item} className={`rounded-md px-3 py-2 text-left text-sm font-bold capitalize ${tab === item ? "bg-ink text-white" : "hover:bg-gray-100"}`} onClick={() => setTab(item)}>
                {item === "cars" ? "Cars" : "Inquiries"}
              </button>
            ))}
            <button className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map(([label, value]) => (
              <div key={label} className="card p-5">
                <p className="text-sm font-bold text-gray-500">{label}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>

          {tab === "cars" && (
            <div className="card mt-7 overflow-hidden">
              <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-5 md:flex-row md:items-center">
                <h2 className="text-2xl font-black">Cars</h2>
                <button className="btn-primary" onClick={() => { setModalCar(null); setModalOpen(true); }}>
                  <Plus size={18} /> Add New Car
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {["Thumbnail", "Name", "Price", "Year", "Location", "Status", "Actions"].map((head) => <th key={head} className="p-4">{head}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {carsData.cars.map((car) => (
                      <tr key={car._id} className="border-t border-gray-100">
                        <td className="p-4"><img src={imageUrl(car.images?.[0])} alt="" className="h-14 w-20 rounded-md object-cover bg-gray-100" /></td>
                        <td className="p-4 font-bold">{car.name}</td>
                        <td className="p-4">{formatPrice(car.price)}</td>
                        <td className="p-4">{car.year}</td>
                        <td className="p-4">{car.location}</td>
                        <td className="p-4"><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Active</span></td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="btn-outline px-3 py-2" onClick={() => { setModalCar(car); setModalOpen(true); }}>Edit</button>
                            <button className="rounded-md border border-gray-300 p-2" onClick={() => toggleFeature(car._id)} aria-label="Feature toggle"><Star size={16} fill={car.is_featured ? "currentColor" : "none"} /></button>
                            <button className="rounded-md border border-red-200 p-2 text-red-600" onClick={() => deleteCar(car._id)} aria-label="Delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "inquiries" && (
            <div className="card mt-7 overflow-hidden">
              <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-5 md:flex-row md:items-center">
                <h2 className="text-2xl font-black">Inquiries</h2>
                <select className="input max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {["Name", "Phone", "Car Name", "Message", "Date", "Status", "Action"].map((head) => <th key={head} className="p-4">{head}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {inquiryData.inquiries.map((inquiry) => (
                      <tr key={inquiry._id} className="border-t border-gray-100">
                        <td className="p-4 font-bold">{inquiry.name}</td>
                        <td className="p-4">{inquiry.phone}</td>
                        <td className="p-4">{inquiry.car_name || "General Inquiry"}</td>
                        <td className="max-w-xs truncate p-4">{inquiry.message}</td>
                        <td className="p-4">{new Date(inquiry.created_at).toLocaleDateString("en-IN")}</td>
                        <td className="p-4"><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">{inquiry.status}</span></td>
                        <td className="p-4">
                          <button className="btn-outline px-3 py-2" onClick={() => markInquiry(inquiry._id, inquiry.status === "New" ? "Contacted" : "Resolved")}>
                            Mark {inquiry.status === "New" ? "Contacted" : "Resolved"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {loading && <p className="mt-4 text-sm text-gray-500">Loading dashboard...</p>}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">{modalCar ? "Edit Car" : "Add New Car"}</h2>
              <button onClick={() => setModalOpen(false)}>Close</button>
            </div>
            <CarForm
              car={modalCar}
              onCancel={() => setModalOpen(false)}
              onSaved={() => {
                setModalOpen(false);
                load();
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
