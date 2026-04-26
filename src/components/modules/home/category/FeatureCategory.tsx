"use client";

import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";
import FeatureCategoryClient from "./FeatureCategoryClient";

const FeatureCategory = () => {
    const { data: catResponse, isLoading } = useQuery({
        queryKey: ["featureCategories"],
        queryFn: () => getCategories({ limit: 10, sortBy: "createdAt", sortOrder: "asc", isFeatured: true })
    });

    const categories = catResponse?.data || [];

    return <FeatureCategoryClient categories={categories} isLoading={isLoading} />
}

export default FeatureCategory