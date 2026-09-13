 
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import api from "@/lib/axios";

interface OrderItem {
  _id: string;

  product?: {
    _id: string;
    title?: string;
    image?: string[];
  };

  title: string;
  images: string[];
  price: number;
  quantity: number;

  selectedOptions?: Record<string, string>;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id: string;

  items: OrderItem[];

  totalAmount: number;

  shippingAddress: ShippingAddress;

  paymentMethod: string;

  paymentStatus: string;

  orderStatus: string;

  createdAt: string;
}

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

const STATUS_OPTIONS = [
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderViewPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  // =====================================================
  // FETCH ORDER
  // =====================================================

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      /* -----------------------------------------------
         CHECK LOGIN
      ------------------------------------------------ */

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace(
          `/login?redirect=/orders/${orderId}`
        );

        return;
      }

      /* -----------------------------------------------
         CHECK ROLE
      ------------------------------------------------ */

      try {
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          const user: UserData =
            JSON.parse(storedUser);

          setIsAdmin(user.role === "admin");
        }
      } catch (error) {
        console.error(
          "User parse error:",
          error
        );
      }

      /* -----------------------------------------------
         FETCH ORDER
      ------------------------------------------------ */

      try {
        setLoading(true);

        const response = await api.get(
          `/orders/${orderId}`
        );

        console.log(
          "Order Response:",
          response.data
        );

        const responseData =
          response.data;

        const fetchedOrder =
          responseData.order ||
          responseData.data;

        if (!fetchedOrder) {
          toast.error("Order not found");

          return;
        }

        setOrder(fetchedOrder);
      } catch (error) {
        console.error(
          "Order Error:",
          error
        );

        if (axios.isAxiosError(error)) {
          const status =
            error.response?.status;

          /* -------------------------------------------
             SESSION EXPIRED
          ------------------------------------------- */

          if (status === 401) {
            localStorage.removeItem("token");

            localStorage.removeItem("user");

            toast.error(
              "Your session has expired. Please login again."
            );

            router.push(
              `/login?redirect=/orders/${orderId}`
            );

            return;
          }

          /* -------------------------------------------
             NOT FOUND
          ------------------------------------------- */

          if (status === 404) {
            toast.error("Order not found");

            return;
          }
        }

        toast.error(
          axios.isAxiosError(error)
            ? error.response?.data?.message ||
                "Failed to load order"
            : "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  // =====================================================
  // UPDATE ORDER STATUS
  // ADMIN ONLY
  // =====================================================

  const handleStatusChange = async (
    newStatus: string
  ) => {
    if (!order) return;

    try {
      setUpdatingStatus(true);

      /*
        BACKEND:

        PUT /orders/admin/:id/status
      */

      const response = await api.put(
        `/orders/admin/${order._id}/status`,
        {
          orderStatus: newStatus,
        }
      );

      console.log(
        "Status Update Response:",
        response.data
      );

      /* -----------------------------------------------
         UPDATE ORDER LOCALLY
      ------------------------------------------------ */

      setOrder((previousOrder) =>
        previousOrder
          ? {
              ...previousOrder,
              orderStatus: newStatus,
            }
          : previousOrder
      );

      toast.success(
        `Order status changed to ${newStatus}`
      );
    } catch (error) {
      console.error(
        "Status Update Error:",
        error
      );

      if (axios.isAxiosError(error)) {
        const status =
          error.response?.status;

        /* -------------------------------------------
           SESSION EXPIRED
        ------------------------------------------- */

        if (status === 401) {
          localStorage.removeItem("token");

          localStorage.removeItem("user");

          toast.error(
            "Your session has expired. Please login again."
          );

          router.push(
            `/login?redirect=/orders/${order._id}`
          );

          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to update order status"
        );
      } else {
        toast.error(
          "Failed to update order status"
        );
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = () => {
    if (!order) return null;

    switch (order.orderStatus) {
      case "confirmed":
        return (
          <CheckCircle className="h-5 w-5" />
        );

      case "shipped":
        return (
          <Truck className="h-5 w-5" />
        );

      case "delivered":
        return (
          <CheckCircle className="h-5 w-5" />
        );

      case "cancelled":
        return (
          <XCircle className="h-5 w-5" />
        );

      default:
        return (
          <Clock className="h-5 w-5" />
        );
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = () => {
    if (!order) {
      return "bg-gray-50 text-gray-700";
    }

    switch (order.orderStatus) {
      case "confirmed":
        return "bg-blue-50 text-blue-700";

      case "shipped":
        return "bg-purple-50 text-purple-700";

      case "delivered":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-yellow-50 text-yellow-700";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-gray-500">
              Loading order...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (!order) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <Package className="h-16 w-16 text-gray-300" />

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Order Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            We couldn't find this order.
          </p>

          <Link
            href="/orders"
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {isAdmin
              ? "All Orders"
              : "My Orders"}
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* =================================================
          BACK
      ================================================= */}

      <Link
        href="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={18} />

        {isAdmin
          ? "Back to All Orders"
          : "Back to My Orders"}
      </Link>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          {/* LEFT */}

          <div>
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-blue-600" />

              <h1 className="text-2xl font-bold text-gray-900">
                Order Details
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Order #{order._id}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Placed on{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          </div>

          {/* =================================================
              ADMIN STATUS SELECT
          ================================================= */}

          {isAdmin ? (
            <select
              value={order.orderStatus}
              disabled={updatingStatus}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value
                )
              }
              className={`w-fit cursor-pointer rounded-full border-0 px-4 py-2 text-sm font-semibold capitalize outline-none ring-1 ring-gray-200 ${getStatusClass()} ${
                updatingStatus
                  ? "cursor-wait opacity-60"
                  : ""
              }`}
            >
              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>
          ) : (
            /* USER STATUS */

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusClass()}`}
            >
              {getStatusIcon()}

              {order.orderStatus}
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="space-y-6 lg:col-span-2">
          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />

              <h2 className="text-xl font-bold text-gray-900">
                Ordered Items
              </h2>
            </div>

            <div className="divide-y">
              {order.items?.map(
                (item) => {
                  const image =
                    item.images?.[0] ||
                    item.product?.image?.[0] ||
                    "";

                  return (
                    <div
                      key={item._id}
                      className="flex gap-4 py-5 first:pt-0 last:pb-0"
                    >
                      {/* IMAGE */}

                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        {image ? (
                          <img
                            src={image}
                            alt={
                              item.title ||
                              item.product
                                ?.title ||
                              "Product"
                            }
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.title ||
                            item.product
                              ?.title ||
                            "Product"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        {/* OPTIONS */}

                        {item.selectedOptions &&
                          Object.keys(
                            item.selectedOptions
                          ).length >
                            0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(
                                item.selectedOptions
                              ).map(
                                ([
                                  key,
                                  value,
                                ]) => (
                                  <span
                                    key={key}
                                    className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                  >
                                    {key}:{" "}
                                    {value}
                                  </span>
                                )
                              )}
                            </div>
                          )}

                        <p className="mt-2 font-semibold text-gray-900">
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      {/* ITEM TOTAL */}

                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-gray-900">
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
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* =================================================
              SHIPPING ADDRESS
          ================================================= */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-600" />

              <h2 className="text-xl font-bold text-gray-900">
                Delivery Address
              </h2>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">
                {
                  order
                    .shippingAddress
                    .name
                }
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {
                  order
                    .shippingAddress
                    .address
                }
              </p>

              <p className="text-sm text-gray-600">
                {
                  order
                    .shippingAddress
                    .city
                }
                ,{" "}
                {
                  order
                    .shippingAddress
                    .state
                }{" "}
                -{" "}
                {
                  order
                    .shippingAddress
                    .pincode
                }
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Phone:{" "}
                {
                  order
                    .shippingAddress
                    .phone
                }
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="space-y-6">
          {/* =================================================
              PAYMENT
          ================================================= */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-green-600" />

              <h2 className="text-xl font-bold text-gray-900">
                Payment
              </h2>
            </div>

            <div className="space-y-3">
              {/* METHOD */}

              <div className="flex justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Method
                </span>

                <span className="text-right text-sm font-semibold uppercase text-gray-900">
                  {
                    order.paymentMethod
                  }
                </span>
              </div>

              {/* STATUS */}

              <div className="flex justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Status
                </span>

                <span className="text-right text-sm font-semibold capitalize text-gray-900">
                  {
                    order.paymentStatus
                  }
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3 border-b pb-5">
              {/* ITEMS */}

              <div className="flex justify-between text-sm text-gray-600">
                <span>Items</span>

                <span>
                  {order.items?.reduce(
                    (total, item) =>
                      total +
                      item.quantity,
                    0
                  )}
                </span>
              </div>

              {/* SUBTOTAL */}

              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>

                <span>
                  ₹
                  {Number(
                    order.totalAmount
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              {/* DELIVERY */}

              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>

                <span className="font-medium text-green-600">
                  Free
                </span>
              </div>
            </div>

            {/* TOTAL */}

            <div className="mt-5 flex justify-between">
              <span className="text-lg font-bold text-gray-900">
                Total
              </span>

              <span className="text-lg font-bold text-gray-900">
                ₹
                {Number(
                  order.totalAmount
                ).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 