"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import api from "@/lib/axios";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/footer/Footer";

export default function SearchPage() {
const searchParams = useSearchParams();

const query = searchParams.get("q") || "";

const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchProducts = async () => {
try {
setLoading(true);

 
    const response = await api.get("/products");

    setProducts(response.data.products || []);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

fetchProducts();
 

}, []);

const searchText = query.toLowerCase().trim();

const filteredProducts = products.filter((product) => {
if (!searchText) {
return false;
}

 
return (
  product.title?.toLowerCase().includes(searchText) ||
  product.description?.toLowerCase().includes(searchText)
);
 

});

return ( 

<>

<main className="container mx-auto px-4 py-8">

 
  {/* Search Heading */}

  <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-900">
      Search Results
    </h1>

    {query && (
      <p className="mt-2 text-gray-500">
        Search results for{" "}
        <span className="font-medium text-gray-800">
          "{query}"
        </span>
      </p>
    )}
  </div>

  {/* Loading */}

  {loading && (
    <div className="py-20 text-center">
      <p className="text-gray-500">
        Searching products...
      </p>
    </div>
  )}

  {/* No Products */}

  {!loading && filteredProducts.length === 0 && (
    <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-white">
      <div className="text-center">

        <h2 className="text-2xl font-semibold text-gray-800">
          No products found
        </h2>

        <p className="mt-3 text-gray-500">
          We couldn't find any products matching{" "}
          <span className="font-medium text-gray-800">
            "{query}"
          </span>
        </p>

      </div>
    </div>
  )}

  {/* Products */}

  {!loading && filteredProducts.length > 0 && (
    <>
      <p className="mb-5 text-sm text-gray-500">
        Found {filteredProducts.length} product
        {filteredProducts.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </>
  )}

</main>

<Footer />
</>

 

);
}
