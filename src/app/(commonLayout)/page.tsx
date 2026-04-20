import HeroSlider from "@/components/modules/home/HeroSlider";
import FeatureCard from "@/components/modules/home/FeatureCard";
import FeatureCategory from "@/components/modules/home/category/FeatureCategory";
import FeatureSnacks from "@/components/modules/home/items/FeatureSnacks";
import HowItWorks from "@/components/modules/home/HowItWorks";
import FeatureReviews from "@/components/modules/home/reviews/FeatureReviews";
import { getBanners } from "@/services/banner.service";

import { IBanner } from "@/types/banner.type";

export default async function Home() {
  let heroBanners: IBanner[] = [];
  try {
    const { data } = await getBanners({ isActive: true });
    if (data && data.length > 0) {
      heroBanners = data.filter((b) => b.banner).sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  } catch (error) {
    console.error("Failed to load banners on server", error);
  }

  return (
    <div className="">
      {/* Hero Section */}
      <section className="w-full">
        <HeroSlider initialSlides={heroBanners} />
      </section>

      {/* Trust & Features Banner */}
      <FeatureCard />

      {/* Featured Categories */}
      <FeatureCategory />

      {/* Featured Snacks */}
      <FeatureSnacks />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Reviews */}
      <FeatureReviews />
    </div>
  );
}
