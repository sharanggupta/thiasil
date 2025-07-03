import { Metadata } from "next";
import ContactForm from "./components/ContactForm/ContactForm";
import FeaturesSection from "./components/FeatureSection/FeatureSection";
import Footer from "./components/Footer/Footer";
import HeroSection from "./components/HeroSection/Hero";
import HiTechSection from "./components/HiTechSection/HiTechSection";
import Navbar from "./components/Navbar/Navbar";
import ProductCardSection from "./components/ProductCardsSection/ProductCardSection";
import ReviewSection from "./components/Reviews/Reviews";
import SmoothScrollToSection from "./components/SmoothScrollToSection";
import { BreadcrumbStructuredData } from "./components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Premium Laboratory Glassware & Silica Crucibles | Thiasil",
  description: "Thiasil manufactures premium individually oxy-fired laboratory glassware including silica crucibles, gooch crucibles, and scientific equipment. Quality rivaling international standards with competitive Indian pricing. Trusted by laboratories worldwide.",
  keywords: [
    "laboratory glassware",
    "silica crucibles", 
    "oxy-fired crucibles",
    "gooch crucibles",
    "quartz crucibles",
    "scientific equipment",
    "analytical chemistry",
    "laboratory supplies",
    "premium quality glassware",
    "Indian manufacturer",
    "laboratory instruments",
    "research equipment"
  ],
  openGraph: {
    title: "Premium Laboratory Glassware & Silica Crucibles | Thiasil",
    description: "Premium individually oxy-fired laboratory glassware including silica crucibles and scientific equipment. Quality rivaling international standards.",
    url: "https://thiasil.com",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Thiasil Premium Laboratory Glassware Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Laboratory Glassware & Silica Crucibles | Thiasil",
    description: "Premium individually oxy-fired laboratory glassware including silica crucibles and scientific equipment.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://thiasil.com",
  },
};

export default function Home() {
  return (
    <div className="main-margin bg-[#f7f7f7] ">
      <BreadcrumbStructuredData 
        items={[
          { name: "Home", url: "https://thiasil.com" }
        ]} 
      />
      <SmoothScrollToSection />
      <Navbar />
      <HeroSection />
      <HiTechSection />
      <FeaturesSection />
      <ProductCardSection />
      <ReviewSection />
      <ContactForm />
      <Footer />
    </div>
  );
}
