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

        <button
          className="grid h-11 w-11 place-items-center rounded-md border border-gray-200 bg-white text-ink shadow-sm md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={26} strokeWidth={2.5} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/60 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="ml-auto flex h-full w-[88vw] max-w-sm flex-col bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-20 items-center justify-between border-b border-gray-200 px-5">
              <div>
                <span className="block text-xl font-black text-ink">Prime Wheels</span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Menu</span>
              </div>
              <button
                className="grid h-11 w-11 place-items-center rounded-md bg-ink text-white"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            <nav className="grid gap-2 p-5">
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-gray-200 px-4 py-4 text-base font-bold text-ink active:bg-gray-100"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto grid gap-3 border-t border-gray-200 p-5">
              <a href="tel:+919999999999" className="btn-outline">
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
