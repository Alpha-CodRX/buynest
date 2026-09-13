 
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import api from "@/lib/axios";

interface Order {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
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

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  /* =====================================================
     FETCH ORDERS
  ===================================================== */

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      /* -----------------------------------------------
         NOT LOGGED IN
      ------------------------------------------------ */

      if (!token) {
        router.replace("/login?redirect=/orders");
        return;
      }

      /* -----------------------------------------------
         CHECK USER ROLE
      ------------------------------------------------ */

      let adminUser = false;

      try {
        if (storedUser) {
          const user: UserData = JSON.parse(storedUser);

          adminUser = user.role === "admin";

          setIsAdmin(adminUser);
        }
      } catch (error) {
        console.error("User parse error:", error);
      }

      /* -----------------------------------------------
         FETCH ORDERS
      ------------------------------------------------ */

      try {
        setLoading(true);

        /*
          ADMIN:
          GET /orders/admin/all

          USER:
          GET /orders/my-orders
        */

        const response = adminUser
          ? await api.get("/orders/admin/all")
          : await api.get("/orders/my-orders");

        console.log("Orders Response:", response.data);

        const responseData = response.data;

        /*
          Support both:

          {
            success: true,
            orders: [...]
          }

          OR

          {
            success: true,
            data: [...]
          }
        */

        if (Array.isArray(responseData.orders)) {
          setOrders(responseData.orders);
        } else if (Array.isArray(responseData.data)) {
          setOrders(responseData.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Orders Error:", error);

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          console.log("Status:", status);
          console.log(
            "Backend Response:",
            error.response?.data
          );

          /* -------------------------------------------
             SESSION EXPIRED
          ------------------------------------------- */

          if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            toast.error("Please login again");

            router.replace("/login?redirect=/orders");

            return;
          }
        }

        toast.error(
          axios.isAxiosError(error)
            ? error.response?.data?.message ||
                "Failed to load orders"
            : "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  /* =====================================================
     UPDATE ORDER STATUS
     ADMIN ONLY
  ===================================================== */

  const handleStatusChange = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      setUpdatingOrder(orderId);

      /*
        BACKEND ROUTE:

        PUT /orders/admin/:id/status
      */

      const response = await api.put(
        `/orders/admin/${orderId}/status`,
        {
          orderStatus: newStatus,
        }
      );

      console.log(
        "Status Update Response:",
        response.data
      );

      /* -----------------------------------------------
         UPDATE UI
      ------------------------------------------------ */

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: newStatus,
              }
            : order
        )
      );

      toast.success(
        `Order status changed to ${newStatus}`
      );
    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        console.log("Status:", status);
        console.log(
          "Backend Response:",
          error.response?.data
        );

        /* -------------------------------------------
           SESSION EXPIRED
        ------------------------------------------- */

        if (status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          toast.error("Please login again");

          router.replace("/login?redirect=/orders");

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
      setUpdatingOrder(null);
    }
  };

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const getStatusClass = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAdmin ? "All Orders" : "My Orders"}
        </h1>

        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-gray-500">
              Loading orders...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =====================================================
     EMPTY
  ===================================================== */

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? "All Orders" : "My Orders"}
          </h1>

          <p className="mt-1 text-gray-500">
            {isAdmin
              ? "Manage and track all customer orders"
              : "View and track your orders"}
          </p>
        </div>

        {/* EMPTY */}

        <div className="mt-8 rounded-xl border bg-white p-12 text-center shadow-sm">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            No Orders Yet
          </h2>

          <p className="mt-2 text-gray-500">
            {isAdmin
              ? "There are no customer orders yet."
              : "You haven't placed any orders yet."}
          </p>

          {!isAdmin && (
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          )}
        </div>
      </main>
    );
  }

  /* =====================================================
     ORDERS
  ===================================================== */

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isAdmin ? "All Orders" : "My Orders"}
        </h1>

        <p className="mt-1 text-gray-500">
          {isAdmin
            ? "Manage and track all customer orders"
            : "View and track your orders"}
        </p>
      </div>

      {/* =================================================
          COUNT
      ================================================= */}

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Total Orders:{" "}
          <span className="font-semibold text-gray-900">
            {orders.length}
          </span>
        </p>
      </div>

      {/* =================================================
          ORDERS
      ================================================= */}

      <div className="mt-5 space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            {/* =========================================
                TOP
            ========================================= */}

            <div className="flex flex-col justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
              {/* ORDER ID */}

              <div>
                <p className="text-xs text-gray-500">
                  Order ID
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  #{order._id.slice(-8)}
                </p>
              </div>

              {/* =====================================
                  STATUS
              ===================================== */}

              {isAdmin ? (
                /* ADMIN SELECT */

                <select
                  value={order.orderStatus}
                  disabled={
                    updatingOrder === order._id
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      order._id,
                      e.target.value
                    )
                  }
                  className={`w-fit cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-medium capitalize outline-none ring-1 ring-gray-200 ${getStatusClass(
                    order.orderStatus
                  )} ${
                    updatingOrder === order._id
                      ? "cursor-wait opacity-60"
                      : ""
                  }`}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                /* USER STATUS */

                <div
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </div>
              )}
            </div>

            {/* =========================================
                DETAILS
            ========================================= */}

            <div className="grid gap-5 py-5 sm:grid-cols-2 md:grid-cols-4">
              {/* AMOUNT */}

              <div>
                <p className="text-xs text-gray-500">
                  Total Amount
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  ₹
                  {Number(
                    order.totalAmount
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              {/* PAYMENT */}

              <div>
                <p className="text-xs text-gray-500">
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
                <p className="text-xs text-gray-500">
                  Order Date
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* ACTION */}

              <div className="flex items-center md:justify-end">
                <Link
                  href={
                    isAdmin
                      ? `/admin/orders/${order._id}`
                      : `/orders/${order._id}`
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  <Eye size={16} />

                  View Order
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
 
