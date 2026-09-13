import Footer from "@/components/footer/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "next/link";

const features = [
  {
    title: "Wide Product Range",
    description:
      "Discover electronics, fashion, grocery, accessories and more in one convenient place.",
  },
  {
    title: "Quality Products",
    description:
      "We aim to provide reliable products from trusted brands and categories.",
  },
  {
    title: "Easy Shopping",
    description:
      "Browse products, compare options, add items to your cart and place your order with ease.",
  },
  {
    title: "Secure Experience",
    description:
      "Your account and shopping experience are designed with security and simplicity in mind.",
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="bg-white text-slate-900">
        <Breadcrumb title="About Us" />

        

        {/* About */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className=" ">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
                Who We Are
              </p>

              <h2 className="text-3xl font-bold md:text-4xl">
                Your one-stop shopping destination
              </h2>

              <p className="mt-6 leading-7 text-gray-600">
                BuyNest brings different product categories together in one
                easy-to-use shopping experience. From everyday essentials to
                electronics, fashion and accessories, our goal is to make it
                easier for customers to discover the products they need.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                We focus on a clean shopping experience where customers can
                explore products, view detailed information, choose available
                options, add products to their cart and manage their orders
                conveniently.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-block rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
              >
                Explore Products
              </Link>
            </div>

            
          </div>
        </section>

        {/* Features */}
        <section className="bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Why BuyNest
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Built around a better shopping experience
              </h2>

              <p className="mt-4 text-gray-600">
                Everything is designed to keep online shopping straightforward
                and convenient.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-lg font-bold text-white">
                    ✓
                  </div>

                  <h3 className="text-lg font-semibold">{feature.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-2xl bg-slate-900 px-6 py-12 text-center md:px-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Our Mission
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold text-white md:text-4xl">
              Making everyday online shopping easier for everyone.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-7 text-gray-400">
              We believe online shopping should be simple, transparent and
              accessible. BuyNest is built with that idea at its core.
            </p>

            <Link
              href="/categories"
              className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-gray-100"
            >
              Browse Categories
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
