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

export const metadata: Metadata = {
  title: "Thiasil | Individually oxy-fired laboratory glassware",
  description:
    "Manufacturers of individually oxy-fired laboratory glassware including crucibles, lids, basin",
  keywords: [
    "crucible",
    "lid",
    "gooch crucible",
    "quartz",
    "silica",
    "volatile matter",
    "circular capsule",
    "muffle stand",
    "boats combustion",
    "triangles on nichrome wire",
    "glass",
  ],
};

export default function Home() {
  return (
    <div className="main-margin bg-[#f7f7f7] ">
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
