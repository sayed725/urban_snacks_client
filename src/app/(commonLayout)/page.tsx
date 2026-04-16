"use client";

import HeroSlider from "@/components/modules/home/HeroSlider";
import { getCategories } from "@/services/category.service";
import { getItems } from "@/services/item.service";
import { useQuery } from "@tanstack/react-query";
import FeatureCard from "@/components/modules/home/FeatureCard";
import FeatureCategory from "@/components/modules/home/FeatureCategory";
import FeatureSnacks from "@/components/modules/home/FeatureSnacks";
import HowItWorks from "@/components/modules/home/HowItWorks";

export default function Home() {
  const { data: catResponse, isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ limit: 10, sortBy: "createdAt", sortOrder: "asc" }),
  });

  const { data: featuredResponse, isLoading: featuredLoading } = useQuery({
    queryKey: ["items", { isFeatured: true }],
    queryFn: () => getItems({ isFeatured: true, limit: 6 }),
  });

  const categories = catResponse?.data || [];
  const featuredItems = featuredResponse?.data || [];

  return (
    <div className="">
      {/* Hero Section */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* Trust & Features Banner */}
      <FeatureCard />

      {/* Featured Categories */}
      <FeatureCategory catsLoading={catsLoading} categories={categories} />

      {/* Featured Snacks */}
      <FeatureSnacks featuredLoading={featuredLoading} featuredItems={featuredItems} />

      {/* How It Works Section */}
      <HowItWorks />
    </div>
  );
}
