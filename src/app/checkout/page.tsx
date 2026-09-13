 
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  User,
  Mail,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/context/CartContext";
import api from "@/lib/axios";
import Footer from "@/components/footer/Footer";

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface LoggedInUser {
  name: string;
  email: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress>({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  /* =====================================================
     CHECK AUTHENTICATION
  ===================================================== */

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login?redirect=/checkout");
        return;
      }

      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        localStorage.removeItem("token");

        toast.error("Please login again");

        router.replace("/login?redirect=/checkout");
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);

        const loggedInUser: LoggedInUser = {
          name: parsedUser?.name || "",
          email: parsedUser?.email || "",
        };

        setUser(loggedInUser);

        setShippingAddress((previous) => ({
          ...previous,
          name: loggedInUser.name,
        }));
      } catch (error) {
        console.error("User JSON error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please login again");

        router.replace("/login?redirect=/checkout");

        return;
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setShippingAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const handlePlaceOrder = async () => {
    /* -----------------------------------------------------
       CHECK LOGIN
    ----------------------------------------------------- */

    const token = localStorage.getItem("token");

    if (!token || !user) {
      toast.error("Please login before placing your order");

      router.push("/login?redirect=/checkout");

      return;
    }

    /* -----------------------------------------------------
       CHECK FRONTEND CART
    ----------------------------------------------------- */

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");

      router.push("/cart");

      return;
    }

    /* -----------------------------------------------------
       ADDRESS
    ----------------------------------------------------- */

    const {
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = shippingAddress;

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your complete address");
      return;
    }

    if (!city.trim()) {
      toast.error("Please enter your city");
      return;
    }

    if (!state.trim()) {
      toast.error("Please enter your state");
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    /* -----------------------------------------------------
       CREATE ORDER
       
       IMPORTANT:
       Backend orderController gets cart from MongoDB.
       We intentionally do NOT send items or totalAmount.
    ----------------------------------------------------- */

    try {
      setLoading(true);

      console.log("Placing COD order...");
      console.log("Frontend cart items:", cart.length);

      const response = await api.post("/orders", {
        shippingAddress: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        paymentMethod: "COD",
      });

      console.log("Order Response:", response.data);

      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      if (response.data?.success === true) {
        const createdOrder =
          response.data?.order ||
          response.data?.data;

        console.log("Created Order:", createdOrder);

        toast.success("Order placed successfully!");

        /*
         * Backend has already created the order
         * and cleared the MongoDB cart.
         *
         * Now clear frontend cart.
         */
        clearCart();

        const orderId = createdOrder?._id;

        if (orderId) {
          router.push(
            `/order-success?orderId=${orderId}`
          );
        } else {
          router.push("/order-success");
        }

        return;
      }

      toast.error(
        response.data?.message ||
          "Order could not be placed"
      );
    } catch (error: any) {
      console.error("Place Order Error:", error);

      const status = error?.response?.status;
      const backendMessage =
        error?.response?.data?.message;

      console.error("Status:", status);
      console.error(
        "Backend Response:",
        error?.response?.data
      );

      /* -----------------------------------------------------
         401 - LOGIN EXPIRED
      ----------------------------------------------------- */

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error(
          "Your session has expired. Please login again."
        );

        router.push("/login?redirect=/checkout");

        return;
      }

      /* -----------------------------------------------------
         CART EMPTY
      ----------------------------------------------------- */

      if (
        status === 400 &&
        backendMessage === "Cart is empty"
      ) {
        toast.error(
          "Your backend cart is empty. Please add the product to your cart again."
        );

        /*
         * Important:
         * Do NOT immediately clear the frontend cart here.
         *
         * The frontend cart and MongoDB cart are currently
         * out of sync.
         */
        return;
      }

      /* -----------------------------------------------------
         SHIPPING ADDRESS ERROR
      ----------------------------------------------------- */

      if (
        status === 400 &&
        backendMessage ===
          "Complete shipping address is required"
      ) {
        toast.error(
          "Please complete your shipping address"
        );

        return;
      }

      /* -----------------------------------------------------
         OTHER BACKEND ERROR
      ----------------------------------------------------- */

      toast.error(
        backendMessage ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     AUTH CHECK LOADING
  ===================================================== */

  if (checkingAuth) {
    return (
      <>
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-gray-500">
            Checking login...
          </p>
        </div>
      </main>
      <Footer />
      </>
    );
  }

  /* =====================================================
     EMPTY FRONTEND CART
  ===================================================== */

  if (!cart || cart.length === 0) {
    return (
     <>
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300" />

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some products before proceeding to checkout.
          </p>

          <Link
            href="/products"
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
      <Footer />
     </>
    );
  }

  /* =====================================================
     CHECKOUT PAGE
  ===================================================== */

  return (
  <>
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        <p className="mt-1 text-gray-500">
          Complete your delivery details and place your order
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="space-y-6 lg:col-span-2">
          {/* ACCOUNT INFORMATION */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Account Information
                </h2>

                <p className="text-sm text-gray-500">
                  Your logged-in account
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <div className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-3">
                  <User className="h-5 w-5 text-gray-400" />

                  <span className="text-gray-700">
                    {user?.name || "User"}
                  </span>
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <div className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-3">
                  <Mail className="h-5 w-5 text-gray-400" />

                  <span className="truncate text-gray-700">
                    {user?.email || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DELIVERY ADDRESS */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delivery Address
                </h2>

                <p className="text-sm text-gray-500">
                  Enter where you want your order delivered
                </p>
              </div>
            </div>

            {/* FULL NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={shippingAddress.name}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-600 outline-none"
              />
            </div>

            {/* PHONE */}

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                placeholder="Enter 10-digit mobile number"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* ADDRESS */}

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Complete Address
              </label>

              <textarea
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                rows={3}
                placeholder="House no, street, area, landmark"
                disabled={loading}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* CITY / STATE / PINCODE */}

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {/* CITY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  placeholder="City"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* STATE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleChange}
                  placeholder="State"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* PINCODE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={shippingAddress.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="6-digit pincode"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>

                <p className="text-sm text-gray-500">
                  Select your payment method
                </p>
              </div>
            </div>

            {/* COD */}

            <div className="rounded-xl border-2 border-blue-600 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-600">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay when your order is delivered
                  </p>
                </div>

                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="h-fit rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Order Summary
          </h2>

          {/* PRODUCTS */}

          <div className="mt-6 space-y-4">
            {cart.map((item) => {
              const productImage =
                Array.isArray(item.image)
                  ? item.image[0]
                  : item.image;

              return (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-3"
                >
                  {/* IMAGE */}

                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    {productImage ? (
                      <img
                        src={productImage}
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
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* PRICE */}

                  <p className="shrink-0 text-sm font-semibold text-gray-900">
                    ₹
                    {(
                      item.price * item.quantity
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              );
            })}
          </div>

          {/* PRICE DETAILS */}

          <div className="mt-6 space-y-3 border-t pt-5">
            <div className="flex justify-between text-gray-600">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>

              <span>
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>

              <span className="font-medium text-green-600">
                Free
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-lg font-bold text-gray-900">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* PLACE ORDER */}

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Placing Order..."
              : "Place Order - COD"}
          </button>

          {/* BACK TO CART */}

          <Link
            href="/cart"
            className="mt-3 block text-center text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    </main>
    <Footer />
  </>
  );
} 