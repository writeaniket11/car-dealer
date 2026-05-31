import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import ScrollToTop from "../components/ScrollToTop";

export const metadata = {
  title: {
    default: "Prime Wheels Used Cars",
    template: "%s | Prime Wheels"
  },
  description: "Buy inspected second-hand cars with transparent pricing, easy finance, and fast dealer support."
};

export default function RootLayout({ children }) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";

  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton phoneNumber={phone} floating />
        <ScrollToTop />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
