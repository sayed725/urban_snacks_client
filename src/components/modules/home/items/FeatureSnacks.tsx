import React, { Suspense } from 'react'
import { getItems } from "@/services/item.service";
import FeatureSnacksClient from "./FeatureSnacksClient";

const FeatureSnacks = async () => {
    const featuredResponse = await getItems({ isFeatured: true, limit: 6 });
    const featuredItems = featuredResponse?.data || [];

    return (
        <Suspense fallback={
            <section className="py-10 bg-muted/30 overflow-hidden">
                <div className="container mx-auto w-11/12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-80 bg-muted rounded-3xl animate-pulse" />)}
                    </div>
                </div>
            </section>
        }>
            <FeatureSnacksClient featuredItems={featuredItems} />
        </Suspense>
    )
}

export default FeatureSnacks