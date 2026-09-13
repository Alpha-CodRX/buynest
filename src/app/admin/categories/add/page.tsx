 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function AddCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Remove extra spaces
    const categoryName = name.trim();

    // Validation
    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSaving(true);

      // Create category
      const response = await api.post("/categories", {
        name: categoryName,
      });

      console.log(
        "Add Category Response:",
        response.data
      );

      // Success
      toast.success(
        response.data?.message ||
          "Category added successfully"
      );

      // Clear form
      setName("");

      // Go back to categories
      router.push("/admin/categories");
      router.refresh();

    } catch (error: any) {
      console.error(
        "Add Category Error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to add category"
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Add Category
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new product category
        </p>
      </div>


      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl rounded-xl border bg-white p-6 shadow-sm"
      >

        {/* Category Name */}
        <div>
          <label
            htmlFor="category-name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>

          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter category name"
            disabled={saving}
            className="w-full rounded-lg border px-4 py-2.5 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>


        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">

          {/* Cancel */}
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/categories"
              )
            }
            disabled={saving}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>


          {/* Add */}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Adding..."
              : "Add Category"}
          </button>

        </div>
      </form>

    </div>
  );
} 