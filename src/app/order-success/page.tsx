 
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/axios";

interface Order {
  _id: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items?: {
    _id: string;
    title: string;
    price: number;
    quantity: number;
    images?: string[];
  }[];
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     FETCH ORDER
  ===================================================== */

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await api.get(
          `/orders/${orderId}`
        );

        console.log(
          "Order Response:",
          response.data
        );

        if (!response.data?.success) {
          setError(
            response.data?.message ||
              "Failed to load order"
          );

          return;
        }

        /*
         * Backend may return:
         *
         * response.data.order
         *
         * or
         *
         * response.data.data
         */

        const fetchedOrder =
          response.data.order ||
          response.data.data;

        if (!fetchedOrder) {
          setError("Order not found");
          return;
        }

        setOrder(fetchedOrder);
      } catch (error: any) {
        console.error(
          "Fetch Order Error:",
          error
        );

        console.error(
          "Backend Response:",
          error?.response?.data
        );

        setError(
          error?.response?.data?.message ||
            "Unable to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-gray-500">
            Loading your order...
          </p>
        </div>
      </main>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !order) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Package className="h-8 w-8 text-red-500" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Order Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            {error ||
              "We could not find your order."}
          </p>

          {orderId && (
            <p className="mt-3 break-all text-xs text-gray-400">
              Order ID: {orderId}
            </p>
          )}

          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping

            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>
      </main>
    );
  }

  /* =====================================================
     SUCCESS PAGE
  ===================================================== */

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">

      {/* =================================================
          SUCCESS HEADER
      ================================================= */}

      <div className="text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-2 text-gray-500">
          Thank you for your order. Your order has
          been successfully placed.
        </p>

      </div>

      {/* =================================================
          ORDER CARD
      ================================================= */}

      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">

        {/* ORDER HEADER */}

        <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="mt-1 break-all font-semibold text-gray-900">
              #{order._id}
            </p>
          </div>

          <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold capitalize text-green-700">
            {order.orderStatus}
          </div>

        </div>

        {/* ORDER DETAILS */}

        <div className="grid gap-4 border-b py-5 sm:grid-cols-3">

          {/* TOTAL */}

          <div>
            <p className="text-sm text-gray-500">
              Total Amount
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              ₹
              {Number(
                order.totalAmount
              ).toLocaleString("en-IN")}
            </p>
          </div>

          {/* PAYMENT */}

          <div>
            <p className="text-sm text-gray-500">
              Payment
            </p>

            <p className="mt-1 font-semibold uppercase text-gray-900">
              {order.paymentMethod}
            </p>

            <p className="text-xs capitalize text-gray-500">
              {order.paymentStatus}
            </p>
          </div>

          {/* DATE */}

          <div>
            <p className="text-sm text-gray-500">
              Order Date
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {new Date(
                order.createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
          </div>

        </div>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {order.items &&
          order.items.length > 0 && (
            <div className="pt-5">

              <div className="mb-4 flex items-center gap-2">

                <ShoppingBag className="h-5 w-5 text-blue-600" />

                <h2 className="font-bold text-gray-900">
                  Order Items
                </h2>

              </div>

              <div className="space-y-4">

                {order.items.map(
                  (item) => {
                    const image =
                      item.images?.[0];

                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 rounded-lg border p-3"
                      >

                        {/* IMAGE */}

                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">

                          {image ? (
                            <img
                              src={image}
                              alt={item.title}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}

                        </div>

                        {/* PRODUCT */}

                        <div className="min-w-0 flex-1">

                          <p className="line-clamp-2 text-sm font-medium text-gray-900">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Qty:{" "}
                            {item.quantity}
                          </p>

                        </div>

                        {/* PRICE */}

                        <p className="shrink-0 font-semibold text-gray-900">
                          ₹
                          {(
                            Number(
                              item.price
                            ) *
                            item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

      </div>

      {/* =================================================
          ACTION BUTTONS
      ================================================= */}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

        <Link
          href="/admin/orders"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <Package className="h-5 w-5" />

          View My Orders
        </Link>

        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Continue Shopping

          <ArrowRight className="h-5 w-5" />
        </Link>

      </div>

    </main>
  );
} 
