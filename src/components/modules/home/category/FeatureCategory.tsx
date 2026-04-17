import React, { Suspense } from 'react'
import { getCategories } from "@/services/category.service";
import FeatureCategoryClient from "./FeatureCategoryClient";

const FeatureCategory = async () => {
    const catResponse = await getCategories({ limit: 10, sortBy: "createdAt", sortOrder: "asc" });
    const categories = catResponse?.data || [];

    return (
        <Suspense fallback={
            <div className='bg-muted/30 overflow-hidden'>
                <section className="py-10 container w-11/12 mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />)}
                    </div>
                </section>
            </div>
        }>
            <FeatureCategoryClient categories={categories} />
        </Suspense>
    )
}

export default FeatureCategory