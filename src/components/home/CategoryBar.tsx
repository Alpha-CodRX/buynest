 
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export const CategoryBar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        console.log(
          "CategoryBar API:",
          response.data
        );

        setCategories(
          response.data.categories || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch categories:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3">

        {loading ? (
          <span className="text-sm text-gray-500">
            Loading categories...
          </span>
        ) : (
          categories.map((category) => (
            <button
              key={category._id}
              type="button"
              className="whitespace-nowrap text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              {category.name}
            </button>
          ))
        )}

      </div>
    </div>
  );
}; 