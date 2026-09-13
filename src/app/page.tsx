// import { CategoryBar } from "@/components/home/CategoryBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSlider from "@/components/home/HeroSlider";
import Categories from "@/components/category/Categories";
import PromoBanner from "@/components/banners/PromoBanner";
import Footer from "@/components/footer/Footer"; 
import Services from "@/components/home/Services";

export default function Home() {
  return (
    <>
      {/* <CategoryBar /> */}
 <HeroSlider />

      <main className=" ">
       
        <Categories />

        <PromoBanner />


      <FeaturedProducts />

      <Services />

        

      </main>
      <Footer />
    </>
  );
}
