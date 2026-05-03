"use client";

import { useState } from "react";
import BlogHero from "@/components/modules/blog/BlogHero";
import FeaturedPost from "@/components/modules/blog/FeaturedPost";
import BlogGrid from "@/components/modules/blog/BlogGrid";

// EMBEDDED DATA TO ENSURE NO IMPORT ISSUES
const FEATURED_POST = {
  id: "feat-1",
  title: "The Ultimate Guide to Pairing Spicy Beef Jerky with Craft Beverages",
  slug: "ultimate-guide-spicy-jerky-pairing",
  excerpt: "Elevate your snacking experience. Discover why our premium spicy beef jerky perfectly complements a cold IPA or a smooth cider.",
  content: "Full content goes here...",
  coverImage: "/assets/urban_paralax.jpg", 
  category: "Recipes",
  readTime: "6 min read",
  publishedAt: "Oct 24, 2026",
  author: {
    name: "Alex Jensen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    role: "Chief Flavor Officer",
  },
  tags: ["Beef Jerky", "Recipes", "Pairings"],
};

const BLOG_POSTS = [
  {
    id: "post-1",
    title: "5 Creative Ways to Level Up Your Beef Jerky Game",
    slug: "creative-beef-jerky-uses",
    excerpt: "Jerky isn't just for road trips. Learn how to use our premium cuts in salads, trail mixes, and even as a pizza topping!",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop", 
    category: "Beef Jerky",
    readTime: "4 min read",
    publishedAt: "Oct 18, 2026",
    author: {
      name: "Sarah Kline",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
      role: "Lead Product Developer",
    },
    tags: ["Beef Jerky", "Snack Tips", "Cooking"],
  },
  {
    id: "post-2",
    title: "Why Dried Fruits are the Perfect Pre-Workout Snack",
    slug: "dried-fruits-pre-workout",
    excerpt: "Get a natural energy boost without the sugar crash. We dive into the science behind dried mangoes and pineapples for athletes.",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2070&auto=format&fit=crop", 
    category: "Dried Fruits",
    readTime: "5 min read",
    publishedAt: "Oct 12, 2026",
    author: {
      name: "Dr. Marcus Reed",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000&auto=format&fit=crop",
      role: "Nutrition Consultant",
    },
    tags: ["Dried Fruits", "Health", "Fitness"],
  },
  {
    id: "post-3",
    title: "Coming Soon: The Urban Snacks Smoked Hickory Collection",
    slug: "smoked-hickory-collection-reveal",
    excerpt: "Our team has been working for months to perfect the deep, woody notes of our upcoming hickory collection. Here is a sneak peek.",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1511910849309-0dffb8785146?q=80&w=2070&auto=format&fit=crop", 
    category: "New Arrivals",
    readTime: "3 min read",
    publishedAt: "Oct 05, 2026",
    author: {
      name: "Alex Jensen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
      role: "Chief Flavor Officer",
    },
    tags: ["Beef Jerky", "New Arrivals", "Inside Urban"],
  },
  {
    id: "post-4",
    title: "How to Build the Ultimate Charcuterie Board for Game Day",
    slug: "ultimate-charcuterie-board-guide",
    excerpt: "Impress your guests with a professional-grade board featuring our best-selling jerky and premium dried fruits.",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop", 
    category: "Recipes",
    readTime: "7 min read",
    publishedAt: "Sep 28, 2026",
    author: {
      name: "Emma Stone",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop",
      role: "Community Manager",
    },
    tags: ["Recipes", "Beef Jerky", "Dried Fruits"],
  },
  {
    id: "post-5",
    title: "Sustainable Snacking: Our New Eco-Friendly Packaging",
    slug: "sustainable-snacking-packaging",
    excerpt: "We believe in a crunch that doesn't cost the Earth. Read about our journey to 100% biodegradable packaging solutions.",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop", 
    category: "Inside Urban",
    readTime: "5 min read",
    publishedAt: "Sep 20, 2026",
    author: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop",
      role: "Operations Director",
    },
    tags: ["Inside Urban", "Sustainability", "Future"],
  },
  {
    id: "post-6",
    title: "The Art of Slow-Curing: Why Quality Takes Time",
    slug: "art-of-slow-curing",
    excerpt: "Most snacks are rushed. We take the time to slow-cure every batch for maximum flavor retention. Here's why it matters.",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=2070&auto=format&fit=crop", 
    category: "Inside Urban",
    readTime: "8 min read",
    publishedAt: "Sep 15, 2026",
    author: {
      name: "Sarah Kline",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
      role: "Lead Product Developer",
    },
    tags: ["Inside Urban", "Process", "Quality"],
  },
];

const TAGS = [
  "All", 
  "Beef Jerky", 
  "Dried Fruits", 
  "Recipes", 
  "Snack Tips", 
  "Inside Urban"
];

const BlogPageClient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // Separate filtering for the grid to avoid duplicates when not filtering
  const filteredPosts = [FEATURED_POST, ...BLOG_POSTS].filter((post) => {
    const searchLower = searchQuery.trim().toLowerCase();
    const tagLower = selectedTag.trim().toLowerCase();
    
    // If search is active, check title, excerpt, and tags
    const matchesSearch = searchLower === "" || 
      post.title.toLowerCase().includes(searchLower) || 
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.tags.some(t => t.toLowerCase().includes(searchLower));

    // If tag is selected, check if it's in the post's tags (case-insensitive, substring)
    const matchesTag = tagLower === "all" || 
      post.tags.some(t => t.toLowerCase().includes(tagLower));
    
    return matchesSearch && matchesTag;
  });

  const isFiltering = searchQuery.trim() !== "" || selectedTag !== "All";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <BlogHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        tags={TAGS}
      />
      
      <div key={selectedTag + searchQuery} className="pb-10">
        {!isFiltering ? (
          <>
            <FeaturedPost post={FEATURED_POST} />
            <div className="pt-0">
              {/* Only show the rest of the posts in the grid when not filtering */}
              <BlogGrid posts={BLOG_POSTS} />
            </div>
          </>
        ) : (
          <div className="pt-10">
            {/* Show all matching results in the grid when filtering */}
            <BlogGrid posts={filteredPosts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPageClient;
