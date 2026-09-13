"use client";

import { Search } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductGrid from "./ProductGrid";
import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

function ProductToolbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

  const [search, setSearch] = useState("");

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const [sort, setSort] = useState("newest");

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error(
          "Failed to fetch categories:",
          error
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // =====================================================
  // READ CATEGORY FROM URL
  // =====================================================

  useEffect(() => {
    const categoryId = searchParams.get("category");

    if (categoryId) {
      setSelectedCategories([categoryId]);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = (categoryId: string) => {
    const isSelected =
      selectedCategories.includes(categoryId);

    if (isSelected) {
      // Remove category
      router.push("/products");
      setSelectedCategories([]);
    } else {
      // Go to products page with category ID
      router.push(
        `/products?category=${categoryId}`
      );

      setSelectedCategories([categoryId]);
    }
  };

  // =====================================================
  // PRICE FILTER
  // =====================================================

  const handlePriceChange = (value: string) => {
    switch (value) {
      case "0-10000":
        setMinPrice(0);
        setMaxPrice(10000);
        break;

      case "10000-20000":
        setMinPrice(10000);
        setMaxPrice(20000);
        break;

      case "20000-50000":
        setMinPrice(20000);
        setMaxPrice(50000);
        break;

      case "50000-100000":
        setMinPrice(50000);
        setMaxPrice(100000);
        break;

      case "100000-plus":
        setMinPrice(100000);
        setMaxPrice(0);
        break;

      default:
        setMinPrice(0);
        setMaxPrice(0);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-8 lg:flex-row">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="w-full rounded-xl border bg-white p-5 shadow-sm lg:w-72">

        <h3 className="mb-5 text-xl font-semibold">
          Filters
        </h3>

        {/* =================================================
            CATEGORY
        ================================================= */}

        <div>
          <h4 className="mb-3 font-medium">
            Category
          </h4>

          {loadingCategories ? (
            <p className="text-sm text-gray-500">
              Loading categories...
            </p>
          ) : (
            <div className="max-h-60 space-y-2 overflow-y-auto">

              {categories.map((category) => (
                <label
                  key={category._id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(
                      category._id
                    )}
                    onChange={() =>
                      handleCategoryChange(
                        category._id
                      )
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm">
                    {category.name}
                  </span>
                </label>
              ))}

            </div>
          )}
        </div>

        {/* =================================================
            PRICE
        ================================================= */}

        <div className="mt-8">

          <h4 className="mb-3 font-medium">
            Price
          </h4>

          <select
            defaultValue=""
            onChange={(event) =>
              handlePriceChange(
                event.target.value
              )
            }
            className="w-full rounded-lg border p-2 outline-none focus:border-blue-500"
          >
            <option value="">
              All Prices
            </option>

            <option value="0-10000">
              ₹0 - ₹10,000
            </option>

            <option value="10000-20000">
              ₹10,000 - ₹20,000
            </option>

            <option value="20000-50000">
              ₹20,000 - ₹50,000
            </option>

            <option value="50000-100000">
              ₹50,000 - ₹1,00,000
            </option>

            <option value="100000-plus">
              ₹1,00,000+
            </option>
          </select>

        </div>

      </aside>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <div className="flex-1">

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="mb-8 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-2xl font-bold">
              Products
            </h2>

            <p className="text-sm text-gray-500">
              Browse all products
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:border-blue-500 sm:w-64"
              />

            </div>

            {/* SORT */}

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="newest">
                Newest
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>
            </select>

          </div>
        </div>

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        <ProductGrid
          search={search}
          selectedCategories={selectedCategories}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sort={sort}
        />

      </div>
    </div>
  );
}

export default function ProductToolbar() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductToolbarContent />
    </Suspense>
  );
}