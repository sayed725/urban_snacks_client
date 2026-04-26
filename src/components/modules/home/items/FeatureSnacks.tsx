"use client";

import React from 'react'
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/services/item.service";
import FeatureSnacksClient from "./FeatureSnacksClient";

const FeatureSnacks = () => {
    const { data: featuredResponse, isLoading } = useQuery({
        queryKey: ["featuredItems"],
        queryFn: () => getItems({ isFeatured: true, limit: 6 })
    });

    const featuredItems = featuredResponse?.data || [];

    return <FeatureSnacksClient featuredItems={featuredItems} isLoading={isLoading} />
}

export default FeatureSnacks