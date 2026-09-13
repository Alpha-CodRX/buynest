"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Footer from "@/components/footer/Footer";

export default function CartPage() {
  const { cart, totalItems, totalPrice, updateQuantity, removeFromCart } =
    useCart();

  const handleRemove = (cartItemId: string) => {
    removeFromCart(cartItemId);
    toast.success("Product removed from cart");
  };

  /* =========================
     EMPTY CART
  ========================= */

  if (cart.length === 0) {
    return (
     <>
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some products to your cart and they will appear here.
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

  /* =========================
     CART PAGE
  ========================= */

  return (
  <>
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

        <p className="mt-1 text-gray-500">
          {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {/* =========================
          CART LAYOUT
      ========================= */}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* =========================
            CART ITEMS
        ========================= */}

        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => {
            /*
             * Product image can be:
             *
             * 1. Array -> ["cloudinary-url"]
             * 2. String -> "cloudinary-url"
             * 3. Empty/undefined
             */

            const productImage = Array.isArray(item.image)
              ? item.image[0]
              : item.image;

            const finalImage =
              productImage && productImage.trim()
                ? productImage
                : "/products/placeholder.png";

            return (
              <div
                key={item.cartItemId}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  {/* =========================
                      PRODUCT IMAGE
                  ========================= */}

                  <div className="shrink-0">
                    <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-gray-50">
                      <Image
                        src={finalImage}
                        alt={item.title}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />
                    </div>
                  </div>

                  {/* =========================
                      PRODUCT INFORMATION
                  ========================= */}

                  <div className="flex min-w-0 flex-1 flex-col">
                    {/* Product title + remove */}

                    <div className="flex items-start justify-between gap-3">
                      <div className="">
                        <div className="line-clamp-2 font-semibold text-gray-900 transition text-lg">
                          {item.title}
                        </div>
                        <div className="line-clamp-2 font-semibold text-gray-600 transition ">
                          {item.description}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.cartItemId)}
                        className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove product"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* =========================
                        SELECTED OPTIONS
                    ========================= */}

                    {item.selectedOptions &&
                      Object.keys(item.selectedOptions).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                          {Object.entries(item.selectedOptions).map(
                            ([name, value]) => (
                              <span
                                key={name}
                                className="text-sm text-gray-600"
                              >
                                <span className="font-medium text-gray-800">
                                  {name}:
                                </span>{" "}
                                {String(value)}
                              </span>
                            ),
                          )}
                        </div>
                      )}

                    {/* =========================
                        BOTTOM ROW
                    ========================= */}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                      {/* Quantity */}

                      <div className="flex items-center rounded-md border">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="px-3 py-1.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="min-w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="px-3 py-1.5 transition hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}

                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>

                        <p className="text-sm text-gray-500">
                          ₹{item.price.toLocaleString("en-IN")} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div className="h-fit rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

          <div className="mt-6 space-y-4">
            {/* Items */}

            <div className="flex justify-between text-gray-600">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            {/* Subtotal */}

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>

              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>

            {/* Delivery */}

            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>

              <span className="font-medium text-green-600">Free</span>
            </div>

            {/* Total */}

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>

                <span className="text-lg font-bold text-gray-900">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* =========================
              CHECKOUT
          ========================= */}

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-lg bg-orange-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
          >
            Proceed to Checkout
          </Link>

          {/* =========================
              CONTINUE SHOPPING
          ========================= */}

          <Link
            href="/products"
            className="mt-3 block text-center text-sm font-medium text-blue-600 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  <Footer />
  </>
  );
}
