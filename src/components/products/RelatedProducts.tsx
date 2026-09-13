 
"use client";

import { useEffect, useState } from "react";

import { Product } from "@/types/product";
import ProductCard from "../ProductCard";
import api from "@/lib/axios";

type RelatedProductsProps = {
  product: Product;
};

/* =====================================================
   GET CATEGORY ID
===================================================== */

function getCategoryId(
  category: unknown
): string {
  if (!category) {
    return "";
  }

  /* category = "68abc123..." */

  if (typeof category === "string") {
    return category.trim();
  }

  /* category = { _id, name, slug } */

  if (
    typeof category === "object" &&
    category !== null
  ) {
    const categoryObject =
      category as {
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
   RELATED PRODUCTS
===================================================== */

export default function RelatedProducts({
  product,
}: RelatedProductsProps) {
  const [
    relatedProducts,
    setRelatedProducts,
  ] = useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchRelatedProducts =
      async () => {
        try {
          setLoading(true);

          /* -------------------------------------------
             Get current product category ID
          ------------------------------------------- */

          const categoryId =
            getCategoryId(
              product.category
            );

          if (!categoryId) {
            setRelatedProducts([]);
            return;
          }

          /* -------------------------------------------
             Fetch ALL products
          ------------------------------------------- */

          const response =
            await api.get(
              "/products"
            );

          console.log(
            "ALL PRODUCTS API:",
            response.data
          );

          /* -------------------------------------------
             Get products array
          ------------------------------------------- */

          let products: Product[] =
            [];

          if (
            Array.isArray(
              response.data?.products
            )
          ) {
            products =
              response.data.products;
          } else if (
            Array.isArray(
              response.data?.data
            )
          ) {
            products =
              response.data.data;
          } else if (
            Array.isArray(
              response.data?.data
                ?.products
            )
          ) {
            products =
              response.data.data.products;
          }

          /* -------------------------------------------
             Filter same category
             AND remove current product
          ------------------------------------------- */

          const related =
            products.filter(
              (item) => {
                const itemCategoryId =
                  getCategoryId(
                    item.category
                  );

                return (
                  itemCategoryId ===
                    categoryId &&
                  String(
                    item._id
                  ) !==
                    String(
                      product._id
                    )
                );
              }
            );

          console.log(
            "RELATED PRODUCTS:",
            related
          );

          setRelatedProducts(
            related
          );
        } catch (error) {
          console.error(
            "Failed to fetch related products:",
            error
          );

          setRelatedProducts([]);
        } finally {
          setLoading(false);
        }
      };

    fetchRelatedProducts();
  }, [
    product._id,
    product.category,
  ]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="mt-10">
        <h2 className="mb-5 text-2xl font-semibold">
          Related Products
        </h2>

        <p className="text-gray-500">
          Loading related products...
        </p>
      </section>
    );
  }

  /* =====================================================
     NO RELATED PRODUCTS
  ===================================================== */

  if (
    relatedProducts.length === 0
  ) {
    return null;
  }

  /* =====================================================
     DISPLAY RELATED PRODUCTS
  ===================================================== */

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-semibold">
        Related Products
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {relatedProducts.map(
          (item) => (
            <ProductCard
              key={item._id}
              product={item}
            />
          )
        )}
      </div>
    </section>
  );
} 