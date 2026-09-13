"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import ProductOptions from "./ProductOptions";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({
  product,
}: ProductActionsProps) {
  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>({});

  const handleOptionChange = (
    optionName: string,
    value: string
  ) => {
    setSelectedOptions((previous) => ({
      ...previous,
      [optionName]: value,
    }));
  };

 return (
  <div>
    {product.options &&
      product.options.length > 0 && (
        <ProductOptions
          options={product.options}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
        />
      )}
  </div>
);
}