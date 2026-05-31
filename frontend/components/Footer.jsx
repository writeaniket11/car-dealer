import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-2xl font-black">Prime Wheels</h2>
          <p className="mt-3 text-sm leading-6 text-gray-300">Verified second-hand cars with clear paperwork, fair pricing, and helpful after-sale support.</p>
          <p className="mt-4 text-sm text-gray-300">MG Road, Pune, Maharashtra</p>
        </div>
        <div>
          <h3 className="font-bold">Quick Links</h3>
          <div className="mt-4 grid gap-2 text-sm text-gray-300">
            {["Home", "Cars", "About", "Contact", "Privacy Policy"].map((item) => (
              <Link key={item} href={item === "Home" ? "/" : `/${item.toLowerCase().replaceAll(" ", "-")}`}>
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold">Contact</h3>
          <div className="mt-4 grid gap-2 text-sm text-gray-300">
            <a href="tel:+919999999999">+91 99999 99999</a>
            <a href="mailto:sales@primewheels.example">sales@primewheels.example</a>
            <a href="https://wa.me/919999999999">WhatsApp</a>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>
          </div>
          <div className="mt-5 flex gap-3">
            <Facebook size={20} />
            <Instagram size={20} />
            <Youtube size={22} />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-gray-400">
        Copyright &copy; {new Date().getFullYear()} Prime Wheels. All rights reserved.
      </div>
    </footer>
  );
}
