import Footer from "@/components/footer/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
const returnSections = [
  {
    title: "1. Return Eligibility",
    points: [
      "Products may be eligible for return if they are unused, undamaged and meet the applicable return conditions.",
      "Return eligibility may vary depending on the product category and seller or supplier policy.",
    ],
  },
  {
    title: "2. Return Request",
    points: [
      "Customers should submit a return request within the applicable return period after receiving the order.",
      "The return request should include the relevant order and product details.",
      "BuyNest may review the return request before approving the return.",
    ],
  },
  {
    title: "3. Product Condition",
    points: [
      "Returned products should be in their original condition with original packaging, accessories and applicable tags.",
      "Products that are damaged, used, altered or missing required accessories may not be eligible for return.",
    ],
  },
  {
    title: "4. Non-Returnable Products",
    points: [
      "Certain products may not be eligible for return due to their nature, hygiene requirements or applicable restrictions.",
      "The return eligibility of a product may be displayed on the product page or during the ordering process.",
    ],
  },
  {
    title: "5. Damaged or Incorrect Products",
    points: [
      "If you receive a damaged, defective or incorrect product, contact BuyNest support as soon as possible.",
      "You may be required to provide relevant order details and supporting information to help us investigate the issue.",
    ],
  },
  {
    title: "6. Return Shipping",
    points: [
      "Return shipping arrangements may depend on the reason for the return and the applicable return policy.",
      "Customers may be responsible for return shipping costs in certain situations, such as a change of mind or incorrect information provided during ordering.",
    ],
  },
  {
    title: "7. Refunds",
    points: [
      "Once the returned product has been received and inspected, the refund will be processed if the return is approved.",
      "The time required for the refund to appear may depend on the payment method and the relevant payment provider.",
      "For Cash on Delivery orders, the available refund method may require additional information from the customer.",
    ],
  },
  {
    title: "8. Return Policy Changes",
    points: [
      "BuyNest may update this Return Policy from time to time.",
      "Any changes will be reflected on this page with the updated policy.",
    ],
  },
];
export default function ReturnPage() {
  return (
    <>
      <main className="bg-white text-slate-900">
        {/* Breadcrumb */}
        <Breadcrumb title="Retrun Policy" /> {/* Header */}
        {/* Retrun Policy */}
        <section className="container mx-auto max-w-7xl px-4 mb-4 mt-4">
          <div className=" ">
            <h1 className="mt-2 text-3xl font-bold md:text-4xl mb-3 text-center">
              Retrun Policy
            </h1>
            {returnSections.map((section) => (
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
