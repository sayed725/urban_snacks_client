import React from "react";
import { getItems } from "@/services/item.service";
import FeatureSnacksClient from "./FeatureSnacksClient";

const FeatureSnacks = async () => {
  let featuredItems: any[] = [];
  try {
    const featuredResponse = await getItems(
      { isFeatured: true, limit: 6 },
      { next: { revalidate: 600 } }
    );
    featuredItems = featuredResponse?.data || [];
  } catch (error) {
    console.error("Failed to fetch featured snacks for SSG:", error);
  }

  return <FeatureSnacksClient featuredItems={featuredItems} isLoading={false} />;
};

export default FeatureSnacks;