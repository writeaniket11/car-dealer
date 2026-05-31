"use client";

import { MessageCircle } from "lucide-react";
import { formatPrice } from "../utils/api";

export default function WhatsAppButton({ phoneNumber, carName, price, floating = false }) {
  const text = carName
    ? `Hello, I am interested in ${carName} priced at ${formatPrice(price)}. Please share more details.`
    : "Hello, I am interested in buying a used car. Please share more details.";
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        floating
          ? "fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
          : "inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
      }
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={floating ? 24 : 18} />
      {!floating && <span>WhatsApp</span>}
    </a>
  );
}
