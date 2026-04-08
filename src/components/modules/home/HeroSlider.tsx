"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    title: "Crave-Worthy Snacks",
    subtitle: "Discover the perfect bite for every moment. Sweet, salty, and spicy treats curated just for you.",
    price: "Welcome to Urban Snacks",
    image: "/assets/urban_snaks_cover_photo.jpg",
  },
  {
    id: 2,
    title: "Spicy & Crunchy Delights",
    subtitle: "Turn up the heat with our selection of fiery snacks that pack a punch.",
    price: "Trending Now! 🌶️",
    image: "/assets/urban_snaks_photo1.jpg",
  },
  {
    id: 3,
    title: "Sweet Tooth Satisfaction",
    subtitle: "Indulge in premium chocolates, candies, and freshly baked goods.",
    price: "Our Bestsellers",
    image: "/assets/urban_snaks_photo2.jpg",
  },
  {
    id: 4,
    title: "Healthy & Wholesome",
    subtitle: "Nutritious options that don't compromise on flavor. Fuel your daily hustle.",
    price: "Staff Picks",
    image: "/assets/urban_snaks_photo3.jpg",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] overflow-hidden rounded-b-2xl">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full relative">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent">
              <div className="h-full max-w-7xl mx-auto px-6 flex items-center">
                <div className="text-white max-w-xl space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200">
                    {slide.subtitle}
                  </p>
                  <p className="text-2xl font-semibold">
                    {slide.price}
                  </p>
                  <Button asChild className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold text-lg px-8 py-6 hover:scale-105 border-0">
                    <Link href="/products">Shop Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={() =>
          setCurrent((current - 1 + slides.length) % slides.length)
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() =>
          setCurrent((current + 1) % slides.length)
        }
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-3 w-3 rounded-full transition ${
              current === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}