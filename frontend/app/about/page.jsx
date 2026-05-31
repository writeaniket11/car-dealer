export const metadata = {
  title: "About",
  description: "Learn about Prime Wheels and our verified second-hand car buying experience."
};

export default function AboutPage() {
  return (
    <section className="container-page py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black">About Prime Wheels</h1>
        <p className="mt-5 leading-8 text-gray-700">
          Prime Wheels helps buyers compare inspected second-hand cars with clear pricing,
          ownership details, finance support, and direct dealer communication.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {["Document checks", "Transparent pricing", "Fast inquiry support"].map((item) => (
          <div key={item} className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-black">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">Built into every step of the used car buying journey.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
