import Link from "next/link";
interface BreadcrumbProps {
  title?: string;
  productName?: string;
}
export default function Breadcrumb({ title, productName }: BreadcrumbProps) {
  return (
    <nav className="bg-gray-100 p-2 text-sm text-gray-500">
      {" "}
      <Link href="/" className="hover:text-blue-600">
        {" "}
        Home{" "}
      </Link>{" "}
      {title && (
        <>
          {" "}
          <span className="mx-2">/</span>{" "}
          <span className="font-medium text-gray-800"> {title} </span>{" "}
        </>
      )}{" "}
      {productName && (
        <>
          {" "}
          <span className="mx-2">/</span>{" "}
          <Link href="/products" className="hover:text-blue-600">
            {" "}
            Products{" "}
          </Link>{" "}
          <span className="mx-2">/</span>{" "}
          <span className="font-medium text-gray-800">
            {" "}
            {productName}{" "}
          </span>{" "}
        </>
      )}{" "}
    </nav>
  );
}
