 
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { Product } from "@/types/product";
import api from "@/lib/axios";

/* =====================================================
   CART ITEM TYPE
===================================================== */

export type CartItem = Product & {
  cartItemId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
};

/* =====================================================
   CART CONTEXT TYPE
===================================================== */

type CartContextType = {
  cart: CartItem[];

  addToCart: (
    product: Product,
    selectedOptions?: Record<string, string>,
    quantity?: number
  ) => Promise<void>;

  removeFromCart: (cartItemId: string) => Promise<void>;

  updateQuantity: (
    cartItemId: string,
    quantity: number
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  totalItems: number;

  totalPrice: number;

  loading: boolean;
};

/* =====================================================
   CREATE CONTEXT
===================================================== */

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

/* =====================================================
   CART PROVIDER
===================================================== */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  /* ===================================================
     STATE
  =================================================== */

  const [cart, setCart] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(false);

  /* ===================================================
     LOAD LOCAL CART
  =================================================== */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedCart = localStorage.getItem("cart");

      if (!savedCart) {
        return;
      }

      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        setCart(parsedCart);
      }
    } catch (error) {
      console.error(
        "Failed to load local cart:",
        error
      );

      localStorage.removeItem("cart");
    }
  }, []);

  /* ===================================================
     SAVE LOCAL CART
  =================================================== */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cart]);

  /* ===================================================
     LOAD BACKEND CART
     
     This keeps MongoDB cart and frontend cart
     synchronized after login / page refresh.
  =================================================== */

  useEffect(() => {
    const loadBackendCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await api.get("/cart");

        console.log(
          "Backend Cart Response:",
          response.data
        );

        const backendCart =
          response.data?.cart;

        if (
          !backendCart ||
          !Array.isArray(backendCart.items)
        ) {
          return;
        }

        const formattedCart: CartItem[] =
          backendCart.items
            .filter(
              (item: any) =>
                item.product
            )
            .map((item: any) => {
              const product =
                item.product;

             const selectedOptions: Record<string, string> =
  item.selectedOptions
    ? typeof item.selectedOptions === "object"
      ? item.selectedOptions
      : {}
    : {};

              const cartItemId =
                `${product._id}-${JSON.stringify(
                  selectedOptions
                )}`;

              return {
                ...product,

                cartItemId,

                quantity:
                  item.quantity,

                selectedOptions,
              };
            });

        setCart(formattedCart);
      } catch (error) {
        console.error(
          "Failed to load backend cart:",
          error
        );
      }
    };

    loadBackendCart();
  }, []);

  /* ===================================================
     ADD TO CART
  =================================================== */

  const addToCart = async (
    product: Product,
    selectedOptions: Record<
      string,
      string
    > = {},
    quantity: number = 1
  ) => {
    try {
      setLoading(true);

      /*
       * IMPORTANT
       *
       * Save cart to MongoDB first.
       *
       * Checkout/order system uses MongoDB cart.
       */

      const response = await api.post(
        "/cart",
        {
          productId: product._id,

          quantity,

          selectedOptions,
        }
      );

      console.log(
        "Add To Cart Response:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to add product to cart"
        );
      }

      /* =================================================
         UPDATE FRONTEND CART
      ================================================= */

      const cartItemId =
        `${product._id}-${JSON.stringify(
          selectedOptions
        )}`;

      setCart((currentCart) => {
        const existingItem =
          currentCart.find(
            (item) =>
              item.cartItemId ===
              cartItemId
          );

        /* -----------------------------------------------
           EXISTING ITEM
        ----------------------------------------------- */

        if (existingItem) {
          return currentCart.map(
            (item) =>
              item.cartItemId ===
              cartItemId
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      quantity,
                  }
                : item
          );
        }

        /* -----------------------------------------------
           NEW ITEM
        ----------------------------------------------- */

        return [
          ...currentCart,

          {
            ...product,

            cartItemId,

            quantity,

            selectedOptions,
          },
        ];
      });
    } catch (error: any) {
      console.error(
        "Add To Cart Error:",
        error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================
     REMOVE FROM CART
  =================================================== */

  const removeFromCart = async (
    cartItemId: string
  ) => {
    try {
      /*
       * cartItemId is:
       *
       * productId + selectedOptions
       *
       * Backend needs MongoDB subdocument _id.
       *
       * Therefore find the current backend cart
       * item before removing.
       */

      const response =
        await api.get("/cart");

      const backendCart =
        response.data?.cart;

      const localItem =
        cart.find(
          (item) =>
            item.cartItemId ===
            cartItemId
        );

      if (!localItem) {
        return;
      }

      const backendItem =
        backendCart?.items?.find(
          (item: any) =>
            item.product?._id ===
            localItem._id
        );

      if (!backendItem) {
        /*
         * Backend item does not exist.
         * Remove local item anyway.
         */

        setCart((currentCart) =>
          currentCart.filter(
            (item) =>
              item.cartItemId !==
              cartItemId
          )
        );

        return;
      }

      await api.delete(
        `/cart/${backendItem._id}`
      );

      setCart((currentCart) =>
        currentCart.filter(
          (item) =>
            item.cartItemId !==
            cartItemId
        )
      );
    } catch (error) {
      console.error(
        "Remove Cart Error:",
        error
      );

      throw error;
    }
  };

  /* ===================================================
     UPDATE QUANTITY
  =================================================== */

  const updateQuantity = async (
    cartItemId: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      /*
       * Get backend cart so we can find
       * MongoDB cart item _id.
       */

      const response =
        await api.get("/cart");

      const backendCart =
        response.data?.cart;

      const localItem =
        cart.find(
          (item) =>
            item.cartItemId ===
            cartItemId
        );

      if (!localItem) {
        return;
      }

      const backendItem =
        backendCart?.items?.find(
          (item: any) =>
            item.product?._id ===
            localItem._id
        );

      if (!backendItem) {
        return;
      }

      await api.put(
        `/cart/${backendItem._id}`,
        {
          quantity,
        }
      );

      setCart((currentCart) =>
        currentCart.map((item) =>
          item.cartItemId ===
          cartItemId
            ? {
                ...item,
                quantity,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Update Cart Error:",
        error
      );

      throw error;
    }
  };

  /* ===================================================
     CLEAR CART
  =================================================== */

  const clearCart = async () => {
    try {
      /*
       * Clear MongoDB cart first.
       */

      const token =
        localStorage.getItem("token");

      if (token) {
        await api.delete("/cart");
      }
    } catch (error) {
      console.error(
        "Backend Clear Cart Error:",
        error
      );
    }

    /*
     * Clear frontend cart.
     */

    setCart([]);

    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  };

  /* ===================================================
     TOTAL ITEMS
  =================================================== */

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  /* ===================================================
     TOTAL PRICE
  =================================================== */

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        item.quantity,
    0
  );

  /* ===================================================
     PROVIDER
  =================================================== */

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        removeFromCart,

        updateQuantity,

        clearCart,

        totalItems,

        totalPrice,

        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =====================================================
   USE CART HOOK
===================================================== */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
} 