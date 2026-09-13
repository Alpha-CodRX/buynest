"use client";
import { ProductOption } from "@/types/product";

type ProductOptionsProps = {
  options: ProductOption[];
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, value: string) => void;
};

export default function ProductOptions({
  options,
  selectedOptions,
  onOptionChange,
}: ProductOptionsProps) {
  //   const [selectedOptions, setSelectedOptions] = useState<
  //     Record<string, string>
  //   >({});

  //   const handleOptionChange = (optionName: string, value: string) => {
  //     setSelectedOptions((previous) => ({
  //       ...previous,
  //       [optionName]: value,
  //     }));
  //   };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option.name}>
          {/* Option Name */}

          <h3 className="mb-2 text-XL font-semibold text-gray-900">
            {option.name}:
          </h3>

          {/* Option Values */}

          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onOptionChange(option.name, value)}
                  className={`rounded-md border px-4 py-2 text-sm transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
