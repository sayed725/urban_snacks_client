import { getBanners } from "@/services/banner.service";
import HeroSliderClient from "./HeroSliderClient";

export default async function HeroSlider() {
  let initialSlides: any[] = [];
  try {
    const bannerResponse = await getBanners(
      { isActive: true },
      { next: { revalidate: 600 } }
    );
    initialSlides = bannerResponse?.data || [];
  } catch (error) {
    console.error("Failed to fetch hero banners for SSG:", error);
  }

  return <HeroSliderClient initialSlides={initialSlides} />;
}