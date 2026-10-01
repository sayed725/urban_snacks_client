import React from "react";
import { getCategories } from "@/services/category.service";
import FeatureCategoryClient from "./FeatureCategoryClient";

const FeatureCategory = async () => {
  let categories: any[] = [];
  try {
    const catResponse = await getCategories(
      { limit: 10, sortBy: "createdAt", sortOrder: "asc", isFeatured: true },
      { next: { revalidate: 600 } }
    );
    categories = catResponse?.data || [];
  } catch (error) {
    console.error("Failed to fetch featured categories for SSG:", error);
  }

  return <FeatureCategoryClient categories={categories} isLoading={false} />;
};

export default FeatureCategory;