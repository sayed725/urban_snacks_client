import React, { Suspense } from 'react'
import { getReviews } from "@/services/review.service";
import FeatureReviewsClient from "./FeatureReviewsClient";

const FeatureReviews = async () => {
    const reviewsResponse = await getReviews({ limit: 9, isActive: true, sortBy: "createdAt", sortOrder: "desc" });
    const reviews = reviewsResponse?.data || [];

    return (
        <Suspense fallback={
            <section className="py-10 bg-muted/30 overflow-hidden">
                <div className="container mx-auto w-11/12">
                    <div className="relative">
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="min-w-[300px] h-[400px] rounded-[2rem] bg-muted/50 animate-pulse basis-full sm:basis-1/2 lg:basis-1/3" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        }>
            <FeatureReviewsClient reviews={reviews} />
        </Suspense>
    )
}

export default FeatureReviews