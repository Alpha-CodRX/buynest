 
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { Product } from "@/types/product";

import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductSpecifications from "@/components/products/ProductSpecifications";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductPurchaseSection from "@/components/products/ProductPurchaseSection";
import Footer from "@/components/footer/Footer";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

/* =====================================================
   GET CATEGORY ID FROM PRODUCT
===================================================== */

function getCategoryId(
  category: unknown
): string {
  if (!category) {
    return "";
  }

  /*
   * Product category is normally:
   *
   * "68abc123..."
   */

  if (typeof category === "string") {
    return category.trim();
  }

  /*
   * In case backend returns:
   *
   * {
   *   _id: "68abc123...",
   *   name: "Electronics"
   * }
   */

  if (
    typeof category === "object"
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
   PRODUCT DETAILS PAGE
===================================================== */

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  /* =====================================================
     1. FETCH PRODUCT
  ===================================================== */

  const productResponse =
    await fetch(
      `http://localhost:5000/api/v1/products/${id}`,
      {
        cache: "no-store",
      }
    );

  if (!productResponse.ok) {
    console.error(
      "Failed to fetch product:",
      productResponse.status
    );

    notFound();
  }

  const productData =
    await productResponse.json();

  console.log(
    "PRODUCT API:",
    productData
  );

  /*
   * Backend:
   *
   * {
   *   product: {...}
   * }
   */

  const product: Product =
    productData.product ||
    productData.data;

  if (!product) {
    notFound();
  }

  /* =====================================================
     2. FETCH CATEGORIES
  ===================================================== */

  const categoryResponse =
    await fetch(
      "http://localhost:5000/api/v1/categories",
      {
        cache: "no-store",
      }
    );

  let categories: Category[] =
    [];

  if (categoryResponse.ok) {
    const categoryData =
      await categoryResponse.json();

    console.log(
      "CATEGORY API:",
      categoryData
    );

    /*
     * Your backend response:
     *
     * {
     *   categories: [...]
     * }
     */

    if (
      Array.isArray(
        categoryData.categories
      )
    ) {
      categories =
        categoryData.categories;
    }
  } else {
    console.error(
      "Failed to fetch categories:",
      categoryResponse.status
    );
  }

  /* =====================================================
     3. GET PRODUCT CATEGORY ID
  ===================================================== */

  const productCategoryId =
    getCategoryId(
      product.category
    );

  console.log(
    "PRODUCT CATEGORY ID:",
    productCategoryId
  );

  /* =====================================================
     4. FIND CATEGORY FROM DATABASE
  ===================================================== */

  const matchedCategory =
    categories.find(
      (category) =>
        String(category._id).trim() ===
        productCategoryId
    );

  console.log(
    "MATCHED CATEGORY:",
    matchedCategory
  );

  /* =====================================================
     5. CATEGORY NAME
  ===================================================== */

  const categoryName =
    matchedCategory?.name ||
    "Unknown";

  console.log(
    "FINAL CATEGORY:",
    categoryName
  );

  /* =====================================================
     6. PRODUCT IMAGE
  ===================================================== */

  const productImage =
    Array.isArray(product.image) &&
    product.image.length > 0 &&
    product.image[0]
      ? product.image[0]
      : "/products/placeholder.png";

  /* =====================================================
     7. PAGE
  ===================================================== */

  return (
    <>
      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <Breadcrumb
        productName={product.title}
      />

      <main className=" container mx-auto max-w-7xl px-4 py-6">

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <div className="mt-8 grid gap-10 md:grid-cols-2">

          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

          <div>
            <div className="rounded-xl border bg-white p-6">

              <Image
                src={productImage}
                alt={
                  product.title ||
                  "Product"
                }
                width={500}
                height={500}
                className="mx-auto h-96 w-auto object-contain"
                priority
              />

            </div>
          </div>

          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="flex flex-col">

            {/* CATEGORY */}

            <p className="text-sm font-medium text-blue-600">
              {categoryName}
            </p>

            {/* TITLE */}

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* PRICE */}

            <div className="mt-1">
              <span className="text-xl font-bold">
                ₹
                {Number(
                  product.price
                ).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            {/* STOCK */}

            <div className="mt-2 flex items-center gap-2">

              <Check
                className={`h-5 w-5 ${
                  product.inStock
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              />

              <span
                className={`font-medium ${
                  product.inStock
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {product.inStock
                  ? "In Stock"
                  : "Out Of Stock"}
              </span>

            </div>

            {/* AVAILABLE STOCK */}

            <p className="mt-2 text-sm text-gray-500">
              {product.stock} available
            </p>

            {/* DESCRIPTION */}

            <div className="mt-6 leading-7 text-gray-700">
              {product.description}
            </div>

            {/* PURCHASE */}

            <ProductPurchaseSection
              product={product}
            />

          </div>
        </div>

        {/* =================================================
            SPECIFICATIONS
        ================================================= */}

        <ProductSpecifications
          product={product}
        />

        {/* =================================================
            RELATED PRODUCTS
        ================================================= */}

        <RelatedProducts
          product={product}
        />

      </main>

      <Footer />
    </>
  );
} 