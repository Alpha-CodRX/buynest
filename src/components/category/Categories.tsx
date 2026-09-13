"use client";

import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <h2 className="mb-8 text-2xl font-bold">Shop by Category </h2>
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </section>
    );
  }

  return ( 
    <section className="mt-0 bg-gray-100 py-4">
      {" "}
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-5 text-3xl font-bold text-center">Shop by Category</h2>

       <div className="flex flex-wrap  justify-center gap-6">
        
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
