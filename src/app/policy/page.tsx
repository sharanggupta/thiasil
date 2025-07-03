import { Metadata } from "next";
import {
    GlassButton,
    GlassCard,
    GlassIcon,
    NeonBubblesBackground
} from "../components/Glassmorphism";
import Navbar from "@/app/components/Navbar/Navbar";
import Heading from "@/app/components/common/Heading";
import Breadcrumb from "@/app/components/common/Breadcrumb";
import { GRADIENTS } from "@/lib/constants/gradients";
import { PolicyPageClient } from "./PolicyPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Thiasil Laboratory Glassware",
  description: "Read Thiasil's privacy policy to understand how we collect, use, and protect your personal information. Your privacy and data security are our top priorities.",
  keywords: [
    "thiasil privacy policy",
    "data protection",
    "privacy rights",
    "data collection policy",
    "personal information security",
    "thiasil data policy",
    "privacy protection",
    "data usage policy",
    "laboratory glassware privacy",
    "thiasil legal terms"
  ],
  openGraph: {
    title: "Privacy Policy | Thiasil Laboratory Glassware",
    description: "Read Thiasil's privacy policy to understand how we collect, use, and protect your personal information.",
    url: "https://thiasil.com/policy",
    type: "website",
    images: [
      {
        url: "/images/policy-og.jpg",
        width: 1200,
        height: 630,
        alt: "Thiasil Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Thiasil Laboratory Glassware",
    description: "Read Thiasil's privacy policy to understand how we collect, use, and protect your personal information.",
    images: ["/images/policy-og.jpg"],
  },
  alternates: {
    canonical: "https://thiasil.com/policy",
  },
};


export default function Policy() {
  return <PolicyPageClient />;
}
