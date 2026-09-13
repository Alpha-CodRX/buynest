 
"use client";

import { useEffect, useState } from "react";

import { Product } from "@/types/product";
import api from "@/lib/axios";

type ProductSpecificationsProps = {
  product: Product;
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

/* =====================================================
   GET CATEGORY ID
===================================================== */

function getCategoryId(category: unknown): string {
  if (!category) {
    return "";
  }

  /* -----------------------------------------------
     category = "68abc123..."
  ------------------------------------------------ */

  if (typeof category === "string") {
    return category.trim();
  }

  /* -----------------------------------------------
     category = {
       _id: "68abc123...",
       name: "Laptop"
     }
  ------------------------------------------------ */

  if (
    typeof category === "object" &&
    category !== null
  ) {
    const categoryObject = category as {
      _id?: unknown;
      $oid?: unknown;
    };

    if (categoryObject._id) {
      return String(
        categoryObject._id
      ).trim();
    }

    if (categoryObject.$oid) {
      return String(
        categoryObject.$oid
      ).trim();
    }
  }

  return "";
}

/* =====================================================
   GET POPULATED CATEGORY NAME
===================================================== */

function getCategoryName(
  category: unknown
): string {
  if (
    category &&
    typeof category === "object"
  ) {
    const categoryObject =
      category as {
        name?: unknown;
      };

    if (categoryObject.name) {
      return String(
        categoryObject.name
      ).trim();
    }
  }

  return "";
}

/* =====================================================
   COMPONENT
===================================================== */

export default function ProductSpecifications({
  product,
}: ProductSpecificationsProps) {
  const [categoryName, setCategoryName] =
    useState("Loading...");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        /* -------------------------------------------
           If backend already populated category
        ------------------------------------------- */

        const populatedName =
          getCategoryName(
            product.category
          );

        if (populatedName) {
          setCategoryName(
            populatedName
          );

          return;
        }

        /* -------------------------------------------
           Get category ID
        ------------------------------------------- */

        const productCategoryId =
          getCategoryId(
            product.category
          );

        if (!productCategoryId) {
          setCategoryName(
            "Unknown Category"
          );

          return;
        }

        /* -------------------------------------------
           Fetch categories
        ------------------------------------------- */

        const response =
          await api.get(
            "/categories"
          );

        console.log(
          "CATEGORY API:",
          response.data
        );

        let categories: Category[] =
          [];

        /*
         * Supports:
         *
         * {
         *   categories: [...]
         * }
         *
         * OR
         *
         * {
         *   data: {
         *     categories: [...]
         *   }
         * }
         *
         * OR
         *
         * {
         *   data: [...]
         * }
         */

        if (
          Array.isArray(
            response.data?.categories
          )
        ) {
          categories =
            response.data.categories;
        } else if (
          Array.isArray(
            response.data?.data
              ?.categories
          )
        ) {
          categories =
            response.data.data.categories;
        } else if (
          Array.isArray(
            response.data?.data
          )
        ) {
          categories =
            response.data.data;
        }

        /* -------------------------------------------
           Find category
        ------------------------------------------- */

        const category =
          categories.find(
            (item) =>
              String(
                item._id
              ).trim() ===
              productCategoryId
          );

        console.log(
          "PRODUCT CATEGORY ID:",
          productCategoryId
        );

        console.log(
          "MATCHED CATEGORY:",
          category
        );

        /* -------------------------------------------
           Set category name
        ------------------------------------------- */

        setCategoryName(
          category?.name ||
            "Unknown Category"
        );
      } catch (error) {
        console.error(
          "Failed to fetch category:",
          error
        );

        setCategoryName(
          "Unknown Category"
        );
      }
    };

    fetchCategory();
  }, [product.category]);

  return (
    <section className="mt-8 rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Product Specification
      </h2>

      <div className="divide-y">

        {/* =================================================
            CATEGORY
        ================================================= */}

        <div className="flex py-3">
          <span className="w-40 text-gray-500">
            Category
          </span>

          <span className="font-medium text-gray-800">
            {categoryName}
          </span>
        </div>

        {/* =================================================
            AVAILABILITY
        ================================================= */}

        <div className="flex py-3">
          <span className="w-40 text-gray-500">
            Availability
          </span>

          <span
            className={`font-medium ${
              product.inStock
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {product.inStock
              ? "In Stock"
              : "Out of Stock"}
          </span>
        </div>

        {/* =================================================
            STOCK
        ================================================= */}

        <div className="flex py-3">
          <span className="w-40 text-gray-500">
            Stock
          </span>

          <span className="font-medium text-gray-800">
            {product.stock} available
          </span>
        </div>

      </div>
    </section>
  );
} 