"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Category {
_id: string;
name: string;
}

export default function AdminCategoriesPage() {
const [categories, setCategories] = useState<Category[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchCategories = async () => {
try {
setLoading(true);
setError("");

 
    const response = await api.get("/categories");

    console.log(
      "Categories Response:",
      response.data
    );

    const responseData = response.data;

    let categoryList: Category[] = [];

    if (Array.isArray(responseData.data)) {
      categoryList = responseData.data;
    } else if (
      Array.isArray(responseData.categories)
    ) {
      categoryList = responseData.categories;
    }

    setCategories(categoryList);
  } catch (error) {
    console.error(
      "Categories Error:",
      error
    );

    setError("Failed to load categories");
    toast.error("Failed to load categories");
  } finally {
    setLoading(false);
  }
};

fetchCategories();
 

}, []);

const handleDelete = async (
categoryId: string
) => {
const confirmed = window.confirm(
"Are you sure you want to delete this category?"
);

 
if (!confirmed) {
  return;
}

try {
  await api.delete(
    `/categories/${categoryId}`
  );

  setCategories((previousCategories) =>
    previousCategories.filter(
      (category) =>
        category._id !== categoryId
    )
  );

  toast.success(
    "Category deleted successfully"
  );
} catch (error) {
  console.error(
    "Delete Category Error:",
    error
  );

  toast.error(
    "Failed to delete category"
  );
}
 

};

if (loading) {
return ( <div> <h1 className="text-2xl font-bold">
Categories </h1>

 
    <p className="mt-4 text-gray-500">
      Loading categories...
    </p>
  </div>
);
 

}

if (error) {
return ( <div> <h1 className="text-2xl font-bold">
Categories </h1>

 
    <p className="mt-4 text-red-500">
      {error}
    </p>
  </div>
);
 

}

return ( <div>
{/* Header */} <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold">
Categories </h1>

 
      <p className="mt-1 text-sm text-gray-500">
        Manage your store categories
      </p>
    </div>

    <Link
      href="/admin/categories/add"
      className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
    >
      <Plus size={18} />
      Add Category
    </Link>
  </div>

  {/* Count */}
  <div className="mt-6">
    <p className="text-sm text-gray-500">
      Total Categories:{" "}
      <span className="font-semibold text-gray-900">
        {categories.length}
      </span>
    </p>
  </div>

  {/* Empty State */}
  {categories.length === 0 ? (
    <div className="mt-6 rounded-xl border bg-white p-10 text-center shadow-sm">
      <p className="text-gray-500">
        No categories found.
      </p>
    </div>
  ) : (
    <div className="mt-4 overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full min-w-[600px]">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              #
            </th>

            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Category
            </th>

            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {categories.map(
            (category, index) => (
              <tr
                key={category._id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm text-gray-500">
                  {index + 1}
                </td>

                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">
                    {category.name}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/categories/edit/${category._id}`}
                    className="mr-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        category._id
                      )
                    }
                    className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )}
</div>
 

);
}
