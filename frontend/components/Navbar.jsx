"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import WhatsAppButton from "./WhatsAppButton";

const links = [
  ["Home", "/"],
  ["Cars", "/cars"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tight text-ink">
          Prime Wheels
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-gray-700 hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+919999999999" className="btn-outline py-2">
            <Phone size={16} /> Call Now
          </a>
          <WhatsAppButton phoneNumber={phone} />
        </div>

        <button className="md:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <div className="ml-auto h-full w-80 max-w-[86vw] bg-white p-5" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-black">Prime Wheels</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <div className="grid gap-4">
              {links.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="text-base font-semibold">
                  {label}
                </Link>
              ))}
              <a href="tel:+919999999999" className="btn-outline mt-4">
                <Phone size={16} /> Call Now
              </a>
              <WhatsAppButton phoneNumber={phone} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
