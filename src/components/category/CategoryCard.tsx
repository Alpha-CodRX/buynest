"use client";

import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category._id}`}
      className="group flex min-h-10 items-center justify-center rounded-xl border bg-white px-4 py-5 text-center shadow-sm transition   hover:border-blue-500 hover:shadow-md"
    >
      {" "}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18"/><path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25"/><circle cx="18" cy="20" r="2"/><circle cx="8" cy="20" r="2"/></svg>
      <h3 className="text-sm font-semibold text-gray-800 transition group-hover:text-blue-600 text-xl pl-2">
        {category.name}{" "}
      </h3>{" "}
    </Link>
  );
}
