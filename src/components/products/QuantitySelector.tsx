 
"use client";

type QuantitySelectorProps = {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
};

export default function QuantitySelector({
  quantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  return (
    <div className="mt-8 flex items-center gap-4">
      <span className="font-semibold">
        Quantity
      </span>

      <div className="flex items-center overflow-hidden rounded-md border border-gray-300">

        <button
          type="button"
          onClick={() => {
            if (quantity > 1) {
              onQuantityChange(quantity - 1);
            }
          }}
          className="px-4 py-2 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={quantity <= 1}
        >
          −
        </button>

        <span className="flex min-w-[50px] items-center justify-center border-x border-gray-300 px-3 py-2 font-semibold">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => {
            onQuantityChange(quantity + 1);
          }}
          className="px-4 py-2 text-lg hover:bg-gray-100"
        >
          +
        </button>

      </div>
    </div>
  );
} 