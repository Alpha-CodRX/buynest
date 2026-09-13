"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";
import { toast } from "sonner";

interface ProductOption {
  name: string;
  values: string[];
}

interface Product {
  _id: string;
  title: string;
  price: number;
  description?: string;
  category?: string | { _id: string; name: string };
  image?: string[];
  images?: string[];
  stock?: number;
  options?: ProductOption[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        console.log(
          "Products Response:",
          response.data
        );

        const responseData = response.data;

        let productList: Product[] = [];

        if (Array.isArray(responseData.data)) {
          productList = responseData.data;
        } else if (
          Array.isArray(responseData.products)
        ) {
          productList = responseData.products;
        }

        setProducts(productList);
      } catch (error) {
        console.error(
          "Products Error:",
          error
        );

        setError(
          "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (
    productId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/products/${productId}`
      );

      setProducts(
        (previousProducts) =>
          previousProducts.filter(
            (product) =>
              product._id !== productId
          )
      );

      toast.success(
        "Product deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      toast.error(
        "Failed to delete product"
      );
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">
          Products
        </h1>

        <p className="mt-4 text-gray-500">
          Loading products...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold">
          Products
        </h1>

        <p className="mt-4 text-red-500">
          {error}
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store products
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* ====================================== */}
      {/* PRODUCT COUNT */}
      {/* ====================================== */}

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Total Products:{" "}
          <span className="font-semibold text-gray-900">
            {products.length}
          </span>
        </p>
      </div>

      {/* ====================================== */}
      {/* EMPTY STATE */}
      {/* ====================================== */}

      {products.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            No products found.
          </p>
        </div>
      ) : (
        /* ====================================== */
        /* PRODUCTS TABLE */
        /* ====================================== */

        <div className="mt-4 overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full min-w-[900px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Price
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Stock
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Options
                </th>

                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50"
                >
                  {/* ====================================== */}
                  {/* PRODUCT */}
                  {/* ====================================== */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* PRODUCT IMAGE */}

                      {product.image?.[0] ? (
                        <img
                          src={
                            product.image[0]
                          }
                          alt={product.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : product.images?.[0] ? (
                        <img
                          src={
                            product.images[0]
                          }
                          alt={product.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          No Image
                        </div>
                      )}

                      {/* PRODUCT NAME */}

                      <div>
                        <p className="font-medium text-gray-900">
                          {product.title}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ====================================== */}
                  {/* CATEGORY */}
                  {/* ====================================== */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {typeof product.category ===
                    "object"
                      ? product.category.name
                      : product.category ||
                        "-"}
                  </td>

                  {/* ====================================== */}
                  {/* PRICE */}
                  {/* ====================================== */}

                  <td className="px-6 py-4 text-sm font-medium">
                    ₹{product.price}
                  </td>

                  {/* ====================================== */}
                  {/* STOCK */}
                  {/* ====================================== */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.stock ?? 0}
                  </td>

                  {/* ====================================== */}
                  {/* OPTIONS */}
                  {/* ====================================== */}

                  <td className="px-6 py-4">
                    {product.options &&
                    product.options.length > 0 ? (
                      <div className="space-y-1">
                        {product.options.map(
                          (
                            option,
                            optionIndex
                          ) => (
                            <div
                              key={`${product._id}-option-${optionIndex}`}
                              className="text-sm"
                            >
                              <span className="font-medium text-gray-700">
                                {option.name}:
                              </span>{" "}
                              <span className="text-gray-500">
                                {option.values?.join(
                                  ", "
                                ) || "-"}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        No options
                      </span>
                    )}
                  </td>

                  {/* ====================================== */}
                  {/* ACTIONS */}
                  {/* ====================================== */}

                  <td className="px-6 py-4 text-right">
                    {/* EDIT */}

                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="mr-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          product._id
                        )
                      }
                      className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}