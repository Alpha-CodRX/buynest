 
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
}

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const categoryId = params.id;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CATEGORY
  // ==========================================
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setLoading(false);
        setError("Category ID is missing");
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("Fetching Category:", categoryId);

        const response = await api.get(
          `/categories/${categoryId}`
        );

        console.log(
          "Category Response:",
          response.data
        );

        const category: Category =
          response.data.category ||
          response.data.data;

        if (!category) {
          throw new Error("Category not found");
        }

        setName(category.name || "");

      } catch (error) {
        console.error(
          "Fetch Category Error:",
          error
        );

        if (axios.isAxiosError(error)) {
          console.log(
            "Status:",
            error.response?.status
          );

          console.log(
            "Backend Response:",
            error.response?.data
          );
        }

        setError("Failed to load category");

        toast.error(
          "Failed to load category"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);


  // ==========================================
  // UPDATE CATEGORY
  // ==========================================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error("Category ID is missing");
      return;
    }

    const categoryName = name.trim();

    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      console.log(
        "Updating Category:",
        categoryId
      );

      // IMPORTANT:
      // Backend route is PUT
      const response = await api.put(
        `/categories/${categoryId}`,
        {
          name: categoryName,
        }
      );

      console.log(
        "Update Category Response:",
        response.data
      );

      toast.success(
        response.data?.message ||
          "Category updated successfully"
      );

      router.push("/admin/categories");
      router.refresh();

    } catch (error) {
      console.error(
        "Update Category Error:",
        error
      );

      if (axios.isAxiosError(error)) {
        console.log(
          "Status:",
          error.response?.status
        );

        console.log(
          "Backend Response:",
          error.response?.data
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to update category"
        );
      } else {
        toast.error(
          "Failed to update category"
        );
      }

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
          Edit Category
        </h1>

        <p className="mt-4 text-gray-500">
          Loading category...
        </p>
      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold">
          Edit Category
        </h1>

        <p className="mt-4 text-red-500">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/categories"
            )
          }
          className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          Back to Categories
        </button>
      </div>
    );
  }


  // ==========================================
  // FORM
  // ==========================================
  return (
    <div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Edit Category
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update category information
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
            required
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


          {/* Update */}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Updating..."
              : "Update Category"}
          </button>

        </div>
      </form>
    </div>
  );
} 