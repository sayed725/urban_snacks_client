import { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog | Urban Snacks",
  description: "Read the latest stories, tips, and snacking secrets from Urban Snacks.",
};

export default function BlogPage() {
  return <BlogPageClient />;
}
