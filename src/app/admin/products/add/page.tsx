"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
}

interface ProductOption {
  name: string;
  values: string[];
}

interface ProductForm {
  title: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  inStock: boolean;
  options: ProductOption[];
}

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    inStock: true,
    options: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await api.get("/categories");

        console.log("Categories Response:", response.data);

        setCategories(response.data.categories || []);
      } catch (error: any) {
        console.error("Fetch Categories Error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load categories",
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE IMAGE
  // ==========================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      toast.error("You can select a maximum of 5 images");

      setImages(selectedFiles.slice(0, 5));
      return;
    }

    setImages(selectedFiles);
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = (index: number) => {
    setImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  // ==========================================
  // ADD PRODUCT OPTION
  // ==========================================

  const addOption = () => {
    setFormData((previous) => ({
      ...previous,
      options: [
        ...previous.options,
        {
          name: "",
          values: [""],
        },
      ],
    }));
  };

  // ==========================================
  // REMOVE PRODUCT OPTION
  // ==========================================

  const removeOption = (optionIndex: number) => {
    setFormData((previous) => ({
      ...previous,
      options: previous.options.filter((_, index) => index !== optionIndex),
    }));
  };

  // ==========================================
  // UPDATE OPTION NAME
  // ==========================================

  const updateOptionName = (optionIndex: number, name: string) => {
    setFormData((previous) => ({
      ...previous,
      options: previous.options.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              name,
            }
          : option,
      ),
    }));
  };

  // ==========================================
  // UPDATE OPTION VALUE
  // ==========================================

  const updateOptionValue = (
    optionIndex: number,
    valueIndex: number,
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      options: previous.options.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              values: option.values.map((item, itemIndex) =>
                itemIndex === valueIndex ? value : item,
              ),
            }
          : option,
      ),
    }));
  };

  // ==========================================
  // ADD OPTION VALUE
  // ==========================================

  const addOptionValue = (optionIndex: number) => {
    setFormData((previous) => ({
      ...previous,
      options: previous.options.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              values: [...option.values, ""],
            }
          : option,
      ),
    }));
  };

  // ==========================================
  // REMOVE OPTION VALUE
  // ==========================================

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    setFormData((previous) => ({
      ...previous,
      options: previous.options.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              values: option.values.filter(
                (_, itemIndex) => itemIndex !== valueIndex,
              ),
            }
          : option,
      ),
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!formData.title.trim()) {
      toast.error("Product title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }

    if (!formData.price) {
      toast.error("Price is required");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.stock) {
      toast.error("Stock is required");
      return;
    }

    // ------------------------------------------
    // VALIDATE OPTIONS
    // ------------------------------------------

    for (
      let optionIndex = 0;
      optionIndex < formData.options.length;
      optionIndex++
    ) {
      const option = formData.options[optionIndex];

      if (!option.name.trim()) {
        toast.error(`Option ${optionIndex + 1} name is required`);
        return;
      }

      const hasValue = option.values.some((value) => value.trim());

      if (!hasValue) {
        toast.error(`Please add at least one value for ${option.name}`);
        return;
      }
    }

    try {
      setSaving(true);

      // ------------------------------------------
      // FORM DATA
      // ------------------------------------------

      const data = new FormData();

      data.append("title", formData.title.trim());

      data.append("description", formData.description.trim());

      data.append("price", formData.price);

      // CATEGORY ID
      data.append("category", formData.category);

      data.append("stock", formData.stock);

      data.append("inStock", String(formData.inStock));

      // ------------------------------------------
      // OPTIONS
      // ------------------------------------------

      const cleanedOptions = formData.options
        .filter((option) => option.name.trim())
        .map((option) => ({
          name: option.name.trim(),

          values: option.values
            .filter((value) => value.trim())
            .map((value) => value.trim()),
        }));

      data.append("options", JSON.stringify(cleanedOptions));

      // ------------------------------------------
      // IMAGES
      // ------------------------------------------

      images.forEach((image) => {
        data.append("images", image);
      });

      console.log("Creating Product...");

      console.log("Product Options:", cleanedOptions);

      // ------------------------------------------
      // API
      // ------------------------------------------

      const response = await api.post("/products", data);

      console.log("Add Product Response:", response.data);

      // ------------------------------------------
      // SUCCESS
      // ------------------------------------------

      toast.success(response.data?.message || "Product added successfully");

      router.push("/admin/products");

      router.refresh();
    } catch (error: any) {
      console.error("Add Product Error:", error);

      console.error("Status:", error.response?.status);

      console.error("Backend Response:", error.response?.data);

      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Product</h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new product to your store
        </p>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        {/* CATEGORY */}

        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={saving || loadingCategories}
            className="w-full rounded-lg border bg-white px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
            required
          >
            <option value="">
              {loadingCategories
                ? "Loading categories..."
                : "Select a category"}
            </option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {!loadingCategories && categories.length === 0 && (
            <p className="mt-2 text-sm text-red-500">
              No categories found. Please create a category first.
            </p>
          )}
        </div>

        {/* PRODUCT TITLE */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Product Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter product title"
            disabled={saving}
            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
            required
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={5}
            disabled={saving}
            className="w-full resize-none rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
            required
          />
        </div>

        {/* PRICE + STOCK */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* PRICE */}

          <div>
            <label className="mb-2 block text-sm font-medium">Price</label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              disabled={saving}
              className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              required
            />
          </div>

          {/* STOCK */}

          <div>
            <label className="mb-2 block text-sm font-medium">Stock</label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              min="0"
              disabled={saving}
              className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              required
            />
          </div>
        </div>

        {/* ====================================== */}
        {/* PRODUCT OPTIONS */}
        {/* ====================================== */}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium">
                Product Options
              </label>

              <p className="mt-1 text-xs text-gray-500">
                Add options like Color, Size, Storage, RAM, etc.
              </p>
            </div>

            <button
              type="button"
              onClick={addOption}
              disabled={saving}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              + Add Option
            </button>
          </div>

          {/* NO OPTIONS */}

          {formData.options.length === 0 && (
            <div className="rounded-lg border border-dashed p-5 text-center text-sm text-gray-500">
              No options added.
            </div>
          )}

          {/* OPTIONS */}

          <div className="space-y-4">
            {formData.options.map((option, optionIndex) => (
              <div key={optionIndex} className="rounded-lg border p-4">
                {/* OPTION NAME */}

                <div className="mb-4 flex items-center gap-3">
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) =>
                      updateOptionName(optionIndex, e.target.value)
                    }
                    placeholder="Option name (e.g. Color)"
                    disabled={saving}
                    className="flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() => removeOption(optionIndex)}
                    disabled={saving}
                    className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>

                {/* VALUES */}

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500">Values</p>

                  {option.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          updateOptionValue(
                            optionIndex,
                            valueIndex,
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Black"
                        disabled={saving}
                        className="flex-1 rounded-lg border px-4 py-2 text-sm outline-none focus:border-black disabled:bg-gray-100"
                      />

                      {option.values.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeOptionValue(optionIndex, valueIndex)
                          }
                          disabled={saving}
                          className="px-3 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* ADD VALUE */}

                <button
                  type="button"
                  onClick={() => addOptionValue(optionIndex)}
                  disabled={saving}
                  className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  + Add Value
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ====================================== */}
        {/* IMAGES */}
        {/* ====================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Product Images
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={saving}
            className="w-full rounded-lg border px-4 py-2.5 text-sm disabled:bg-gray-100"
          />

          <p className="mt-1 text-xs text-gray-500">
            You can select up to 1 image.
          </p>
        </div>

        {/* SELECTED IMAGES */}

        {images.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-medium">Selected Images</p>

            <div className="space-y-2">
              {images.map((image, index) => (
                <div
                  key={`${image.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{image.name}</p>

                    <p className="text-xs text-gray-500">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={saving}
                    className="ml-4 text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================== */}
        {/* IN STOCK */}
        {/* ====================================== */}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={(e) =>
              setFormData((previous) => ({
                ...previous,
                inStock: e.target.checked,
              }))
            }
            disabled={saving}
            className="h-4 w-4"
          />

          <label className="text-sm font-medium">Product is in stock</label>
        </div>

        {/* ====================================== */}
        {/* BUTTONS */}
        {/* ====================================== */}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            disabled={saving}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || loadingCategories || categories.length === 0}
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
