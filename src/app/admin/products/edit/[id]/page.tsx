"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
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

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string | Category;
  stock: number;
  inStock: boolean;
  image?: string[];
  options?: ProductOption[];
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

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params.id as string;

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] =
    useState<ProductForm>({
      title: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      inStock: true,
      options: [],
    });

  // ==========================================
  // CATEGORIES
  // ==========================================

  const [categories, setCategories] =
    useState<Category[]>([]);

  // ==========================================
  // IMAGES
  // ==========================================

  const [existingImages, setExistingImages] =
    useState<string[]>([]);

  const [newImages, setNewImages] =
    useState<File[]>([]);

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await api.get(
          "/categories"
        );

        console.log(
          "Categories Response:",
          response.data
        );

        setCategories(
          response.data.categories || []
        );
      } catch (error: any) {
        console.error(
          "Fetch Categories Error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load categories"
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ==========================================
  // FETCH PRODUCT
  // ==========================================

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        setError(
          "Product ID is missing"
        );
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log(
          "Product ID:",
          productId
        );

        const response = await api.get(
          `/products/${productId}`
        );

        console.log(
          "Product Response:",
          response.data
        );

        const responseData =
          response.data;

        const product: Product =
          responseData.data ||
          responseData.product;

        if (!product) {
          throw new Error(
            "Product not found in API response"
          );
        }

        // ======================================
        // CATEGORY
        // ======================================

        let categoryId = "";

        if (
          typeof product.category ===
          "string"
        ) {
          categoryId =
            product.category;
        } else if (
          product.category
        ) {
          categoryId =
            product.category._id;
        }

        // ======================================
        // OPTIONS
        // ======================================

        const productOptions =
          Array.isArray(
            product.options
          )
            ? product.options.map(
                (option) => ({
                  name:
                    option.name || "",
                  values:
                    Array.isArray(
                      option.values
                    )
                      ? option.values
                      : [],
                })
              )
            : [];

        // ======================================
        // EXISTING IMAGES
        // ======================================

        const productImages =
          Array.isArray(
            product.image
          )
            ? product.image
            : [];

        setExistingImages(
          productImages
        );

        // ======================================
        // SET FORM
        // ======================================

        setFormData({
          title:
            product.title || "",

          description:
            product.description || "",

          price:
            product.price !==
            undefined
              ? product.price.toString()
              : "",

          category:
            categoryId,

          stock:
            product.stock !==
            undefined
              ? product.stock.toString()
              : "",

          inStock:
            product.inStock ??
            true,

          options:
            productOptions,
        });
      } catch (error) {
        console.error(
          "Fetch Product Error:",
          error
        );

        if (
          axios.isAxiosError(error)
        ) {
          console.log(
            "Status:",
            error.response?.status
          );

          console.log(
            "Backend Response:",
            error.response?.data
          );
        }

        setError(
          "Failed to load product"
        );

        toast.error(
          "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // ==========================================
  // HANDLE STOCK
  // ==========================================

  const handleStockChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        inStock:
          e.target.checked,
      })
    );
  };

  // ==========================================
  // REMOVE EXISTING IMAGE
  // ==========================================

  const removeExistingImage = (
    index: number
  ) => {
    setExistingImages(
      (previous) =>
        previous.filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
    );
  };

  // ==========================================
  // HANDLE NEW IMAGE
  // ==========================================

  const handleNewImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) {
      return;
    }

    const selectedFiles =
      Array.from(e.target.files);

    setNewImages(
      (previous) => [
        ...previous,
        ...selectedFiles,
      ]
    );

    // Allow selecting same file again
    e.target.value = "";
  };

  // ==========================================
  // REMOVE NEW IMAGE
  // ==========================================

  const removeNewImage = (
    index: number
  ) => {
    setNewImages(
      (previous) =>
        previous.filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
    );
  };

  // ==========================================
  // ADD OPTION
  // ==========================================

  const addOption = () => {
    setFormData(
      (previous) => ({
        ...previous,
        options: [
          ...previous.options,
          {
            name: "",
            values: [""],
          },
        ],
      })
    );
  };

  // ==========================================
  // REMOVE OPTION
  // ==========================================

  const removeOption = (
    optionIndex: number
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        options:
          previous.options.filter(
            (_, index) =>
              index !== optionIndex
          ),
      })
    );
  };

  // ==========================================
  // UPDATE OPTION NAME
  // ==========================================

  const updateOptionName = (
    optionIndex: number,
    value: string
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        options:
          previous.options.map(
            (option, index) =>
              index === optionIndex
                ? {
                    ...option,
                    name: value,
                  }
                : option
          ),
      })
    );
  };

  // ==========================================
  // ADD OPTION VALUE
  // ==========================================

  const addOptionValue = (
    optionIndex: number
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        options:
          previous.options.map(
            (option, index) =>
              index === optionIndex
                ? {
                    ...option,
                    values: [
                      ...option.values,
                      "",
                    ],
                  }
                : option
          ),
      })
    );
  };

  // ==========================================
  // REMOVE OPTION VALUE
  // ==========================================

  const removeOptionValue = (
    optionIndex: number,
    valueIndex: number
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        options:
          previous.options.map(
            (option, index) =>
              index === optionIndex
                ? {
                    ...option,
                    values:
                      option.values.filter(
                        (_, index) =>
                          index !==
                          valueIndex
                      ),
                  }
                : option
          ),
      })
    );
  };

  // ==========================================
  // UPDATE OPTION VALUE
  // ==========================================

  const updateOptionValue = (
    optionIndex: number,
    valueIndex: number,
    value: string
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        options:
          previous.options.map(
            (option, index) => {
              if (
                index !==
                optionIndex
              ) {
                return option;
              }

              return {
                ...option,
                values:
                  option.values.map(
                    (
                      currentValue,
                      currentIndex
                    ) =>
                      currentIndex ===
                      valueIndex
                        ? value
                        : currentValue
                  ),
              };
            }
          ),
      })
    );
  };

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!productId) {
      toast.error(
        "Product ID is missing"
      );
      return;
    }

    if (!formData.title.trim()) {
      toast.error(
        "Product title is required"
      );
      return;
    }

    if (
      !formData.description.trim()
    ) {
      toast.error(
        "Product description is required"
      );
      return;
    }

    if (!formData.price) {
      toast.error(
        "Price is required"
      );
      return;
    }

    if (!formData.category) {
      toast.error(
        "Please select a category"
      );
      return;
    }

    if (!formData.stock) {
      toast.error(
        "Stock is required"
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      // ========================================
      // CLEAN OPTIONS
      // ========================================

      const cleanedOptions =
        formData.options
          .map((option) => ({
            name:
              option.name.trim(),

            values:
              option.values
                .map((value) =>
                  value.trim()
                )
                .filter(
                  (value) =>
                    value.length > 0
                ),
          }))
          .filter(
            (option) =>
              option.name &&
              option.values.length > 0
          );

      // ========================================
      // FORM DATA
      // ========================================

      const data = new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "price",
        String(
          Number(formData.price)
        )
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "stock",
        String(
          Number(formData.stock)
        )
      );

      data.append(
        "inStock",
        String(formData.inStock)
      );

      // ========================================
      // EXISTING IMAGES
      // ========================================

      data.append(
        "existingImages",
        JSON.stringify(
          existingImages
        )
      );

      // ========================================
      // OPTIONS
      // ========================================

      data.append(
        "options",
        JSON.stringify(
          cleanedOptions
        )
      );

      // ========================================
      // NEW IMAGES
      // ========================================

      newImages.forEach(
        (image) => {
          data.append(
            "images",
            image
          );
        }
      );

      console.log(
        "Existing Images:",
        existingImages
      );

      console.log(
        "New Images:",
        newImages
      );

      console.log(
        "Options:",
        cleanedOptions
      );

      // ========================================
      // API
      // ========================================

      const response =
        await api.put(
          `/products/${productId}`,
          data
        );

      console.log(
        "Update Product Response:",
        response.data
      );

      // ========================================
      // SUCCESS
      // ========================================

      toast.success(
        response.data?.message ||
          "Product updated successfully"
      );

      router.push(
        "/admin/products"
      );

      router.refresh();
    } catch (error: any) {
      console.error(
        "Update Product Error:",
        error
      );

      if (
        axios.isAxiosError(error)
      ) {
        console.log(
          "Status:",
          error.response?.status
        );

        console.log(
          "Backend Response:",
          error.response?.data
        );
      }

      setError(
        error.response?.data?.message ||
          "Failed to update product"
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">
          Edit Product
        </h1>

        <p className="mt-4 text-gray-500">
          Loading product...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (
    error &&
    !formData.title
  ) {
    return (
      <div>
        <h1 className="text-2xl font-bold">
          Edit Product
        </h1>

        <p className="mt-4 text-red-500">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/products"
            )
          }
          className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Edit Product
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update your product information
        </p>
      </div>

      {/* ====================================== */}
      {/* ERROR */}
      {/* ====================================== */}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ====================================== */}
      {/* FORM */}
      {/* ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        {/* ====================================== */}
        {/* TITLE */}
        {/* ====================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Product Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={saving}
            placeholder="Enter product title"
            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
            required
          />
        </div>

        {/* ====================================== */}
        {/* DESCRIPTION */}
        {/* ====================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
            disabled={saving}
            rows={5}
            placeholder="Enter product description"
            className="w-full resize-none rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
            required
          />
        </div>

        {/* ====================================== */}
        {/* PRICE + STOCK */}
        {/* ====================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={saving}
              min="0"
              placeholder="Enter price"
              className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              disabled={saving}
              min="0"
              placeholder="Enter stock quantity"
              className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              required
            />
          </div>
        </div>

        {/* ====================================== */}
        {/* CATEGORY */}
        {/* ====================================== */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={
              saving ||
              loadingCategories
            }
            className="w-full rounded-lg border bg-white px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
            required
          >
            <option value="">
              {loadingCategories
                ? "Loading categories..."
                : "Select a category"}
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>

          {!loadingCategories &&
            categories.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                No categories found.
                Please create a category
                first.
              </p>
            )}
        </div>

        {/* ====================================== */}
        {/* PRODUCT IMAGES */}
        {/* ====================================== */}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium">
                Product Images
              </label>

              <p className="mt-1 text-xs text-gray-500">
                Manage existing images or
                upload new ones.
              </p>
            </div>
          </div>

          {/* EXISTING IMAGES */}

          {existingImages.length >
            0 && (
            <div className="mb-5">
              <p className="mb-3 text-sm font-medium">
                Existing Images
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {existingImages.map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative overflow-hidden rounded-lg border bg-gray-50"
                    >
                      <img
                        src={image}
                        alt={`Product image ${
                          index + 1
                        }`}
                        className="h-32 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(
                            index
                          )
                        }
                        disabled={
                          saving
                        }
                        className="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* NO EXISTING IMAGE */}

          {existingImages.length ===
            0 && (
            <div className="mb-5 rounded-lg border border-dashed p-5 text-center">
              <p className="text-sm text-gray-500">
                No existing images.
              </p>
            </div>
          )}

          {/* UPLOAD NEW IMAGES */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Upload New Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleNewImageChange
              }
              disabled={saving}
              className="w-full rounded-lg border px-4 py-2.5 text-sm disabled:bg-gray-100"
            />

            <p className="mt-1 text-xs text-gray-500">
              New images will be uploaded to
              Cloudinary.
            </p>
          </div>

          {/* NEW IMAGES */}

          {newImages.length >
            0 && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-medium">
                New Images
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {newImages.map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={`${image.name}-${index}`}
                      className="relative overflow-hidden rounded-lg border bg-gray-50"
                    >
                      <img
                        src={URL.createObjectURL(
                          image
                        )}
                        alt={
                          image.name
                        }
                        className="h-32 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(
                            index
                          )
                        }
                        disabled={
                          saving
                        }
                        className="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        Remove
                      </button>

                      <div className="p-2">
                        <p className="truncate text-xs font-medium">
                          {
                            image.name
                          }
                        </p>

                        <p className="text-xs text-gray-500">
                          {(
                            image.size /
                            1024 /
                            1024
                          ).toFixed(
                            2
                          )}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* ====================================== */}
        {/* PRODUCT OPTIONS */}
        {/* ====================================== */}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium">
                Product Options
              </label>

              <p className="mt-1 text-xs text-gray-500">
                Add Color, RAM, Size,
                Storage, etc.
              </p>
            </div>

            <button
              type="button"
              onClick={addOption}
              disabled={saving}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              + Add Option
            </button>
          </div>

          {formData.options.length ===
          0 ? (
            <div className="rounded-lg border border-dashed p-5 text-center">
              <p className="text-sm text-gray-500">
                No product options added.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Example: Color → Red,
                Yellow
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.options.map(
                (
                  option,
                  optionIndex
                ) => (
                  <div
                    key={optionIndex}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-medium">
                        Option{" "}
                        {optionIndex +
                          1}
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          removeOption(
                            optionIndex
                          )
                        }
                        disabled={
                          saving
                        }
                        className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      value={
                        option.name
                      }
                      onChange={(e) =>
                        updateOptionName(
                          optionIndex,
                          e.target
                            .value
                        )
                      }
                      disabled={saving}
                      placeholder="Option name e.g. Color, RAM, Size"
                      className="mt-3 w-full rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
                    />

                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium">
                        Values
                      </label>

                      <div className="space-y-2">
                        {option.values.map(
                          (
                            value,
                            valueIndex
                          ) => (
                            <div
                              key={
                                valueIndex
                              }
                              className="flex gap-2"
                            >
                              <input
                                type="text"
                                value={
                                  value
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateOptionValue(
                                    optionIndex,
                                    valueIndex,
                                    e
                                      .target
                                      .value
                                  )
                                }
                                disabled={
                                  saving
                                }
                                placeholder="Enter value"
                                className="flex-1 rounded-lg border px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeOptionValue(
                                    optionIndex,
                                    valueIndex
                                  )
                                }
                                disabled={
                                  saving ||
                                  option
                                    .values
                                    .length <=
                                    1
                                }
                                className="rounded-lg border px-3 text-sm text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Remove
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addOptionValue(
                            optionIndex
                          )
                        }
                        disabled={saving}
                        className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        + Add Value
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* ====================================== */}
        {/* IN STOCK */}
        {/* ====================================== */}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={
              formData.inStock
            }
            onChange={
              handleStockChange
            }
            disabled={saving}
            className="h-4 w-4"
          />

          <label className="text-sm font-medium">
            Product is in stock
          </label>
        </div>

        {/* ====================================== */}
        {/* BUTTONS */}
        {/* ====================================== */}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/products"
              )
            }
            disabled={saving}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              saving ||
              loadingCategories ||
              categories.length === 0
            }
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Updating..."
              : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}