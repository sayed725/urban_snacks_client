"use client";

import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/services/review.service";
import FeatureReviewsClient from "./FeatureReviewsClient";

const FeatureReviews = () => {
    const { data: reviewsResponse, isLoading } = useQuery({
        queryKey: ["featureReviews"],
        queryFn: () => getReviews({ limit: 9, isActive: true, sortBy: "createdAt", sortOrder: "desc" })
    });

    const reviews = reviewsResponse?.data || [];

    return <FeatureReviewsClient reviews={reviews} isLoading={isLoading} />
}

export default FeatureReviews