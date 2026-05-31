import InquiryForm from "../../components/InquiryForm";

export const metadata = {
  title: "Contact",
  description: "Contact Prime Wheels for used car inquiries, dealership hours, and location details."
};

export default function ContactPage() {
  return (
    <section className="container-page py-10">
      <h1 className="text-4xl font-black">Contact Prime Wheels</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-5">
          <div className="card p-6">
            <h2 className="text-xl font-black">Dealer Info</h2>
            <div className="mt-4 grid gap-2 text-gray-700">
              <p>MG Road, Pune, Maharashtra</p>
              <p>Phone: +91 99999 99999</p>
              <p>Email: sales@primewheels.example</p>
              <p>Working Hours: Mon-Sat, 10:00 AM - 7:00 PM</p>
            </div>
          </div>
          <iframe
            title="Dealer location map"
            className="h-80 w-full rounded-lg border-0"
            loading="lazy"
            src="https://www.google.com/maps?q=Pune%20Maharashtra&output=embed"
          />
        </div>
        <InquiryForm carName="General Inquiry" />
      </div>
    </section>
  );
}
