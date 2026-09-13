"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProductCard from "../ProductCard";
import { Product } from "@/types/product";
import api from "@/lib/axios";

const categoryNames = [
  "Mobiles",
  "Laptops",
  "Home Entertainment",
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        console.log("Products API:", response.data);

        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="mt-7">
      <div className="mx-auto max-w-7xl px-4">
        {loading ? (
          <p className="text-center text-gray-500">
            Loading products...
          </p>
        ) : (
          categoryNames.map((categoryName) => {
            const categoryProducts = products
              .filter(
                (product) =>
                  product.category?.name === categoryName
              )
              .slice(0, 5);

            return (
              <div key={categoryName} className="mb-10">
                {/* Heading + View All */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {categoryName}
                    </h2>

                    <p className="mt-1 text-gray-500">
                      Handpicked products for you
                    </p>
                  </div>

                  <Link
                    href="/products"
                    className="rounded-lg border px-5 py-2 transition hover:bg-gray-100"
                  >
                    View All
                  </Link>
                </div>

                {/* Products */}
                {categoryProducts.length === 0 ? (
                  <p className="text-gray-500">
                    No products found.
                  </p>
                ) : (
                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-5
                      sm:grid-cols-2
                      md:grid-cols-3
                      lg:grid-cols-4
                      xl:grid-cols-5
                    "
                  >
                    {categoryProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}