import Footer from "@/components/footer/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
const privacySections = [
  {
    title: "1. Information We Collect",
    points: [
      "We may collect information such as your name, email address, shipping address and contact details when you create an account or place an order.",
      "We may also collect information about products you add to your cart and orders you place on BuyNest.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    points: [
      "To create and manage your account.",
      "To process and deliver your orders.",
      "To provide customer support and respond to your requests.",
      "To improve our website, products and overall shopping experience.",
    ],
  },
  {
    title: "3. Account Security",
    points: [
      "You are responsible for keeping your account credentials secure.",
      "Do not share your password or authentication information with anyone.",
      "If you notice any suspicious activity on your account, contact us as soon as possible.",
    ],
  },
  {
    title: "4. Payment Information",
    points: [
      "BuyNest may offer different payment methods depending on availability.",
      "We do not intentionally store sensitive payment information unless required by the payment service used by the platform.",
      "Payment-related information may be processed by the relevant payment provider.",
    ],
  },
  {
    title: "5. Cookies",
    points: [
      "BuyNest may use cookies or similar technologies to improve website functionality and user experience.",
      "Cookies may help us remember preferences and maintain certain website features.",
    ],
  },
  {
    title: "6. Third-Party Services",
    points: [
      "BuyNest may use trusted third-party services for features such as authentication, image hosting, analytics or payment processing.",
      "These services may process information according to their own privacy policies.",
    ],
  },
  {
    title: "7. Data Protection",
    points: [
      "We take reasonable steps to protect your personal information from unauthorized access, modification or misuse.",
      "However, no online service can guarantee complete security of information transmitted over the internet.",
    ],
  },
  {
    title: "8. Changes to This Privacy Policy",
    points: [
      "We may update this Privacy Policy from time to time.",
      "Any changes will be reflected on this page with an updated policy date.",
    ],
  },
];
export default function PrivacyPage() {
  return (
    <>
      <main className="bg-white text-slate-900">
        {/* Breadcrumb */} <Breadcrumb title="Privacy Policy" /> {/* Header */}
        
        {/* Privacy Content */}
        <section className="container mx-auto max-w-7xl px-4 mb-4 mt-4">
          <div className=" ">
             
            <h1 className="mt-2 text-3xl font-bold md:text-4xl mb-3 text-center">
              Privacy Policy
            </h1>
            {privacySections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-slate-900">
                  {section.title}
                </h2>
                <ul className="mt-2 mb-4 list-disc space-y-3 pl-6 text-gray-600">
                  {section.points.map((point) => (
                    <li key={point} className="leading-7 mb-0">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
