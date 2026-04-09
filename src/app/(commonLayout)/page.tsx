"use client";

import HeroSlider from "@/components/modules/home/HeroSlider";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/features/category/services/category.service";
import { getItems } from "@/features/item/services/item.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import FeatureCard from "@/components/modules/home/FeatureCard";
import FeatureCategory from "@/components/modules/home/FeatureCategory";
import FeatureSnacks from "@/components/modules/home/FeatureSnacks";

export default function Home() {
  const { data: catResponse, isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ limit: 10 }),
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
     <FeatureCard/>

      {/* Featured Categories */}
      <FeatureCategory catsLoading={catsLoading} categories={categories} />

      {/* Featured Snacks */}
     <FeatureSnacks featuredLoading={featuredLoading} featuredItems={featuredItems} />
    </div>
  );
}
