import { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Thiasil Laboratory Glassware",
  description: "Get in touch with Thiasil for inquiries, quotes, and support. Contact our team for premium laboratory glassware and silica crucibles. We respond within 24 hours.",
  keywords: [
    "contact thiasil",
    "laboratory glassware inquiry",
    "silica crucibles quote",
    "thiasil contact information",
    "laboratory equipment support",
    "Mumbai glassware manufacturer",
    "thiasil phone number",
    "thiasil email address",
    "laboratory supplies contact",
    "scientific equipment inquiry"
  ],
  openGraph: {
    title: "Contact Us | Thiasil Laboratory Glassware",
    description: "Get in touch with Thiasil for inquiries, quotes, and support. Contact our team for premium laboratory glassware and silica crucibles.",
    url: "https://thiasil.com/contact",
    type: "website",
    images: [
      {
        url: "/images/contact-og.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Thiasil Laboratory Glassware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Thiasil Laboratory Glassware",
    description: "Get in touch with Thiasil for inquiries, quotes, and support. Premium laboratory glassware and silica crucibles.",
    images: ["/images/contact-og.jpg"],
  },
  alternates: {
    canonical: "https://thiasil.com/contact",
  },
};

export default function Contact() {
  return <ContactPageClient />;
}
