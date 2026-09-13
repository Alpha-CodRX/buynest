import Link from "next/link";
const footerColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "Products", href: "/products" }, 
      { label: "Login", href: "/login" },
      { label: "My Orders", href: "/admin/orders" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "My Account", href: "/admin" },
      { label: "Cart", href: "/cart" }, 
      { label: "Track Order", href: "/admin/orders" },
      { label: "Help Center", href: "/shipping" },
    ],
  },
  {
    title: "Information",
    links: [ 
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Return Policy", href: "/returns" },
    ],
  }, 
];
export default function FooterColumn() {
  return (
    <>
      {" "}
      {footerColumns.map((column) => (
        <div key={column.title}>
          {" "}
          <h3 className="mb-4 text-lg font-semibold text-white">
            {" "}
            {column.title}{" "}
          </h3>{" "}
          <div className="flex flex-col gap-3">
            {" "}
            {column.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-400 transition hover:text-white"
              >
                {" "}
                {link.label}{" "}
              </Link>
            ))}{" "}
          </div>{" "}
        </div>
      ))}{" "}
    </>
  );
}
