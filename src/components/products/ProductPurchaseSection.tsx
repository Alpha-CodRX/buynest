"use client"; 
import { useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";

import { Product } from "@/types/product";
import ProductOptions from "./ProductOptions";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Link from "next/link";

type ProductPurchaseSectionProps = {
  product: Product;
};

export default function ProductPurchaseSection({
  product,
}: ProductPurchaseSectionProps) {
  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>({});

  const [quantity, setQuantity] = useState(1);


  const totalOptions =
  product.options?.length || 0;

const selectedCount =
  Object.keys(
    selectedOptions
  ).length;

  const { addToCart } = useCart();

  const handleOptionChange = (
    optionName: string,
    value: string
  ) => {
    setSelectedOptions((previous) => ({
      ...previous,
      [optionName]: value,
    }));
  };
const handleAddToCart = async () => {
  if (
    totalOptions > 0 &&
    selectedCount !== totalOptions
  ) {
    toast.error("Please select all options");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login first");
    return;
  }

  try {
    await addToCart(
      product,
      selectedOptions,
      quantity
    );

    toast.success("Product added to cart");
  } catch (error) {
    toast.error("Failed to add product to cart");
  }
};

  return (
    <div>
      {product.options &&
        product.options.length > 0 && (
          <div className="mt-8">
            <ProductOptions
              options={product.options}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />
          </div>
        )}

      <div className="mt-8">
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          // disabled={!product.inStock}
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </button>

        <Link href="/cart"
          // disabled={!product.inStock}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          <Zap className="h-5 w-5" />
          Buy Now
        </Link>
      </div>
    </div>
  );
}