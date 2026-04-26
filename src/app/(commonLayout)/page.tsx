import HeroSlider from "@/components/modules/home/HeroSlider";
import FeatureCard from "@/components/modules/home/FeatureCard";
import FeatureCategory from "@/components/modules/home/category/FeatureCategory";
import FeatureSnacks from "@/components/modules/home/items/FeatureSnacks";
import HowItWorks from "@/components/modules/home/HowItWorks";
import FeatureReviews from "@/components/modules/home/reviews/FeatureReviews";
export default function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="w-full">
        <HeroSlider />
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
