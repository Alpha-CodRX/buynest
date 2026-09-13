 
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import api from "@/lib/axios";

interface ProductCardProps {
  product: Product;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const [categoryName, setCategoryName] =
    useState("Loading...");

  // Fetch category name
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get("/categories");

        const categories: Category[] =
          response.data.categories || [];

        const category = categories.find(
          (item) => item._id === product.category
        );

        setCategoryName(
          category?.name || "Unknown Category"
        );
      } catch (error) {
        console.error(
          "Failed to fetch category:",
          error
        );

        setCategoryName("Unknown Category");
      }
    };

    fetchCategory();
  }, [product.category]);

  // Add to cart
  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(product);
  };

  // Product image
  const productImage =
    product.image?.[0] ||
    "/products/placeholder.png";

  return (
    <Link
      href={`/products/${product._id}`}
      className="block"
    >
      <div className="group relative overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition hover:shadow-lg">

        {/* Product Image */}
        <div className="relative h-48 overflow-hidden rounded-lg bg-gray-50 sm:h-56 md:h-60">
          <Image
            src={productImage}
            alt={product.title}
            width={300}
            height={300}
            className="mx-auto h-52 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Title */}
        <h3 className="mt-3 font-semibold">
          {product.title}
        </h3>

        {/* Category Name */}
        {/* <p className="text-sm text-gray-500">
          {categoryName}
        </p> */}

        {/* Stock */}
        <p
          className={`mt-2 text-sm font-medium ${
            product.inStock
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {product.inStock
            ? "In Stock"
            : "Out of Stock"}
        </p>

        {/* Price */}
        <div className="mt-3">
          <span className="text-xl font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Stock Count */}
        <p className="mt-1 text-sm text-gray-500">
          {product.stock} available
        </p>

        {/* Add To Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`mt-5 w-full rounded-lg py-2 text-white transition ${
            product.inStock
              ? "cursor-pointer bg-blue-600 hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          {product.inStock
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
      </div>
    </Link>
  );
} 