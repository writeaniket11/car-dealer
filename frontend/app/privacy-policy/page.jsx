export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Prime Wheels used car dealership inquiries."
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container-page py-12">
      <h1 className="text-4xl font-black">Privacy Policy</h1>
      <p className="mt-5 max-w-3xl leading-8 text-gray-700">
        Inquiry details are used only to contact you about cars, finance support, and dealership visits.
        We do not sell your personal information. Admins can update inquiry status after contacting you.
      </p>
    </section>
  );
}
