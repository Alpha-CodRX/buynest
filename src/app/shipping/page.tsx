import Footer from "@/components/footer/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
const shippingSections = [
  {
    title: "1. Shipping Information",
    points: [
      "BuyNest delivers orders to eligible locations based on the shipping address provided during checkout.",
      "Customers are responsible for providing a complete and accurate shipping address and contact information.",
    ],
  },
  {
    title: "2. Order Processing",
    points: [
      "Orders are processed after successful order placement and confirmation.",
      "Processing time may vary depending on product availability and order details.",
      "Orders may take additional time during weekends, holidays or high-demand periods.",
    ],
  },
  {
    title: "3. Delivery Time",
    points: [
      "Estimated delivery time may vary depending on the delivery location and product availability.",
      "Delivery dates shown during checkout are estimates and are not guaranteed.",
      "Unexpected circumstances such as weather, transportation issues or courier delays may affect delivery times.",
    ],
  },
  {
    title: "4. Shipping Charges",
    points: [
      "Shipping charges, if applicable, will be displayed during the checkout process.",
      "Shipping charges may vary depending on the order, delivery location and applicable shipping method.",
    ],
  },
  {
    title: "5. Order Tracking",
    points: [
      "Where tracking information is available, customers may use the provided order details to track their shipment.",
      "Tracking information may take some time to update after the order has been dispatched.",
    ],
  },
  {
    title: "6. Delivery Issues",
    points: [
      "If an order is delayed, damaged or marked as delivered but has not been received, customers should contact BuyNest support.",
      "We may request order and delivery details to investigate shipping-related issues.",
    ],
  },
  {
    title: "7. Failed Delivery",
    points: [
      "Customers should be available at the provided delivery address to receive their order.",
      "Multiple unsuccessful delivery attempts or an incorrect address may result in the order being returned.",
      "Additional shipping charges may apply if an order needs to be reshipped due to incorrect information provided by the customer.",
    ],
  },
  {
    title: "8. Shipping Policy Changes",
    points: [
      "BuyNest may update this Shipping Policy from time to time.",
      "Any changes will be reflected on this page with the updated policy.",
    ],
  },
];
export default function ShoppingPage() {
  return (
    <>
      <main className="bg-white text-slate-900">
        {/* Breadcrumb */} <Breadcrumb title="Shipping Policy" /> {/* Header */}
        {/* Shipping Policy */}
        <section className="container mx-auto max-w-7xl px-4 mb-4 mt-4">
          <div className=" ">
            <h1 className="mt-2 text-3xl font-bold md:text-4xl mb-3 text-center">
              Shipping Policy
            </h1>
            {shippingSections.map((section) => (
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
