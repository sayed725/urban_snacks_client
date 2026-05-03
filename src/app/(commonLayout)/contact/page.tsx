import ContactPageClient from "./ContactPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Urban Snacks",
  description: "Get in touch with Urban Snacks for bulk orders, questions, and support.",
};

export default function ContactPage() {
  return (
    <ContactPageClient />
  );
}
