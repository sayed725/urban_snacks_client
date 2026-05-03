export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
};

export const CATEGORIES = [
  "All", 
  "New Arrivals", 
  "Recipes", 
  "Snack Hacks", 
  "Nutrition", 
  "Behind the Scenes"
];

export const featuredPost: BlogPost = {
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
  tags: ["Jerky", "Pairings", "Gourmet"],
};

export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "5 Creative Ways to Level Up Your Beef Jerky Game",
    slug: "creative-beef-jerky-uses",
    excerpt: "Jerky isn't just for road trips. Learn how to use our premium cuts in salads, trail mixes, and even as a pizza topping!",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop", 
    category: "Snack Hacks",
    readTime: "4 min read",
    publishedAt: "Oct 18, 2026",
    author: {
      name: "Sarah Kline",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
      role: "Lead Product Developer",
    },
    tags: ["Jerky", "Cooking", "Tips"],
  },
  {
    id: "post-2",
    title: "Why Dried Fruits are the Perfect Pre-Workout Snack",
    slug: "dried-fruits-pre-workout",
    excerpt: "Get a natural energy boost without the sugar crash. We dive into the science behind dried mangoes and pineapples for athletes.",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2070&auto=format&fit=crop", 
    category: "Nutrition",
    readTime: "5 min read",
    publishedAt: "Oct 12, 2026",
    author: {
      name: "Dr. Marcus Reed",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000&auto=format&fit=crop",
      role: "Nutrition Consultant",
    },
    tags: ["Health", "Fitness", "Dried Fruit"],
  },
  {
    id: "post-3",
    title: "Coming Soon: The Urban Snacks Smoked Hickory Collection",
    slug: "smoked-hickory-collection-reveal",
    excerpt: "Our team has been working for months to perfect the deep, woody notes of our upcoming hickory collection.",
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
    tags: ["New Flavor", "Smoked", "Sneak Peek"],
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
    tags: ["Party", "Entertaining", "Jerky"],
  },
  {
    id: "post-5",
    title: "Sustainable Snacking: Our New Eco-Friendly Packaging",
    slug: "sustainable-snacking-packaging",
    excerpt: "We believe in a crunch that doesn't cost the Earth. Read about our journey to 100% biodegradable packaging solutions.",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop", 
    category: "Behind the Scenes",
    readTime: "5 min read",
    publishedAt: "Sep 20, 2026",
    author: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop",
      role: "Operations Director",
    },
    tags: ["Eco-friendly", "Sustainability", "Future"],
  },
  {
    id: "post-6",
    title: "The Art of Slow-Curing: Why Quality Takes Time",
    slug: "art-of-slow-curing",
    excerpt: "Most snacks are rushed. We take the time to slow-cure every batch for maximum flavor retention. Here's why it matters.",
    content: "Full content goes here...",
    coverImage: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=2070&auto=format&fit=crop", 
    category: "Behind the Scenes",
    readTime: "8 min read",
    publishedAt: "Sep 15, 2026",
    author: {
      name: "Sarah Kline",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
      role: "Lead Product Developer",
    },
    tags: ["Process", "Quality", "Curing"],
  },
];
