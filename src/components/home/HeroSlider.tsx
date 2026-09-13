"use client";

import Image from "next/image";
import Link from "next/link";
import { banner } from "@/data/banner";
import { useState, useEffect } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentBanner = banner[currentSlide];
  const [isPaused, setIsPaused] = useState(false);

  // next slide function
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banner.length - 1 ? 0 : prev + 1));
  };

  // prev slide function
  const previousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banner.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        previousSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <section
        className="relative overflow-hidden "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Image
          src={currentBanner.image}
          alt={currentBanner.title}
          width={1400}
          height={500}
          className="h-[220px] sm:h-[280px] md:h-[350px] lg:h-[420px] xl:h-[500px] w-full object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent">
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-20 text-white ">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              {" "}
              {currentBanner.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-lg lg:text-xl">
              {currentBanner.subtitle}
            </p>
            <Link
              href={currentBanner.buttonLink}
              className="mt-8 w-fit rounded-lg bg-white px-6 py-3 text-md font-semibold text-black transition duration-300 hover:scale-105 hover:bg-yellow-300"
            >
              {currentBanner.buttonText}
            </Link>
          </div>
        </div>

        <button
          aria-label="Previous Slide"
          onClick={previousSlide}
          className="absolute left-4 top-1/2 hidden h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition duration-300 hover:scale-110 hover:bg-white md:flex"
        >
          <ChevronLeft className="h-6 w-6 cursor-pointer" />
        </button>

        <button
          aria-label="Next Slide"
          onClick={nextSlide}
         className="absolute right-4 top-1/2 hidden h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition duration-300 hover:scale-110 hover:bg-white md:flex"
        >
          <ChevronRight className="h-6 w-6 cursor-pointer" />
        </button>

        <div className="absolute bottom-5 left-1/2 flex  -translate-x-1/2 gap-2">
          {banner.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-8 bg-white" : "w-3 bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
