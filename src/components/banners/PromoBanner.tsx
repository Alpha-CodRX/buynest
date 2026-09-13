import Image from "next/image";
import { promoBanner } from "@/data/promoBanner";

export default function PromoBanner() {
  return (
    <section className="mx-auto mt-2 max-w-7xl px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promoBanner.map((banner) => (
          <div
            key={banner.title}
            className="relative overflow-hidden rounded-2xl"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              width={600}
              height={300}
              className="h-48 w-full object-cover transition duration-300 hover:scale-105 sm:h-52 lg:h-56"
            />

            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-black/35" />
 
          
            <div className="absolute inset-0 flex flex-col justify-center p-5 text-white">
              <h2 className="text-xl font-bold sm:text-2xl">
                {banner.title}
              </h2>

              <p className="mt-2 text-sm text-gray-100">
                {banner.subtitle}
              </p>
            </div> */}
          </div>
        ))}
      </div>
    </section>
  );
}