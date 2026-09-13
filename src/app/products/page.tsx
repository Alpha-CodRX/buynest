import Footer from "@/components/footer/Footer";
import ProductToolbar from "@/components/products/ProductToolbar";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function ProductsPage() {
return (
<> 
<Breadcrumb title="Porducts" />

 
  <main className="container mx-auto px-4 mb-5 ">
    <h1 className="mt-4 text-3xl font-bold">
      All Products
    </h1>

    <p className="mt-1 text-gray-500">
      Discover our latest collection.
    </p>

    <ProductToolbar  />
  </main>

  <Footer />
</>
 

);
}
