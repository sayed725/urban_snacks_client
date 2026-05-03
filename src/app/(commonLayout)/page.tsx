import HeroSlider from "@/components/modules/home/HeroSlider";
import FeatureCard from "@/components/modules/home/FeatureCard";
import FeatureCategory from "@/components/modules/home/category/FeatureCategory";
import FeatureSnacks from "@/components/modules/home/items/FeatureSnacks";
import HowItWorks from "@/components/modules/home/HowItWorks";
import FeatureReviews from "@/components/modules/home/reviews/FeatureReviews";
import WhyChooseUs from "@/components/modules/home/WhyChooseUs";
import StatsCounter from "@/components/modules/home/StatsCounter";
import SpecialOffers from "@/components/modules/home/SpecialOffers";
import NewsletterCTA from "@/components/modules/home/NewsletterCTA";
import FAQSection from "@/components/modules/home/FAQSection";
import SnackTips from "@/components/modules/home/SnackTips";
import ContactSection from "@/components/modules/home/ContactSection";

export default function Home() {
  return (
    <div className="">
      {/* 1. Hero Section */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* 2. Trust & Features Banner */}
      <FeatureCard />

      {/* 3. Featured Categories */}
      <FeatureCategory />

      {/* 4. Featured Snacks */}
      <FeatureSnacks />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />


      {/* 7. How It Works */}
      <HowItWorks />

      {/* 6. Special Offers */}
      <SpecialOffers />
      
      {/* 8. Statistics Counter */}
      <StatsCounter />

      {/* 9. Reviews / Testimonials */}
      <FeatureReviews />

      {/* 10. Blog / Snack Tips */}
      <SnackTips />

      {/* 11. FAQ Section */}
      <FAQSection />

      {/* 12. Newsletter CTA */}
      <NewsletterCTA />

      {/* 13. Contact Section */}
      <ContactSection />
    </div>
  );
}
