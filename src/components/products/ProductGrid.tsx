"use client";

import { useEffect, useState } from "react";

import ProductCard from "../ProductCard";
import api from "@/lib/axios";
import { Product } from "@/types/product";

interface ProductGridProps {
  search: string;
  selectedCategories: string[];
  minPrice: number;
  maxPrice: number;
  sort: string;
}

export default function ProductGrid({
  search,
  selectedCategories,
  minPrice,
  maxPrice,
  sort,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await api.get("/products");

        console.log("Products API:", response.data);

        const fetchedProducts =
          response.data.products ||
          response.data.data ||
          [];

        setProducts(fetchedProducts);
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredProducts = products
    .filter((product) => {
      // -------------------------------------------------
      // SEARCH
      // -------------------------------------------------

      const searchText = search
        .toLowerCase()
        .trim();

      if (searchText) {
        const title =
          product.title?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() || "";

        const matchesSearch =
          title.includes(searchText) ||
          description.includes(searchText);

        if (!matchesSearch) {
          return false;
        }
      }

      // -------------------------------------------------
      // CATEGORY
      // Backend uses Category _id
      // -------------------------------------------------

      if (selectedCategories.length > 0) {
        let productCategoryId = "";

        if (
          typeof product.category === "string"
        ) {
          // category = "65abc123..."
          productCategoryId =
            product.category;
        } else if (
          product.category &&
          typeof product.category === "object"
        ) {
          // category = { _id, name, slug }
          productCategoryId =
            product.category._id;
        }

        if (
          !selectedCategories.includes(
            productCategoryId
          )
        ) {
          return false;
        }
      }

      // -------------------------------------------------
      // MINIMUM PRICE
      // -------------------------------------------------

      if (
        minPrice > 0 &&
        Number(product.price) < minPrice
      ) {
        return false;
      }

      // -------------------------------------------------
      // MAXIMUM PRICE
      // -------------------------------------------------

      if (
        maxPrice > 0 &&
        Number(product.price) > maxPrice
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-low":
          return (
            Number(a.price) -
            Number(b.price)
          );

        case "price-high":
          return (
            Number(b.price) -
            Number(a.price)
          );

        case "rating":
          return (
            (b.rating ?? 0) -
            (a.rating ?? 0)
          );

        case "newest":
          return 0;

        default:
          return 0;
      }
    });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading products...
      </div>
    );
  }

  // =====================================================
  // NO PRODUCTS
  // =====================================================

  if (filteredProducts.length === 0) {
    return (
      <div className="rounded-xl border bg-white py-16 text-center">
        <h3 className="text-xl font-semibold text-gray-900">
          No products found
        </h3>

        <p className="mt-2 text-gray-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  // =====================================================
  // PRODUCTS
  // =====================================================

  return (
    <section className="mt-10">

      {/* RESULT COUNT */}

      <div className="mb-4 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {filteredProducts.length}
        </span>{" "}
        product
        {filteredProducts.length !== 1
          ? "s"
          : ""}
      </div>

      {/* PRODUCT GRID */}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}