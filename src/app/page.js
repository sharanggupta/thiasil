import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/Hero";
import HiTechSection from "./components/HiTechSection/HiTechSection";
import FeaturesSection from "./components/FeatureSection/FeatureSection";
import ProductCardSection from "./components/ProductCardsSection/ProductCardSection";
import ReviewSection from "./components/Reviews/Reviews";
import ContactForm from "./components/ContactForm/ContactForm";
import Footer from "./components/Footer/Footer";
import Head from 'next/head';


export default function Home() {
  return (
    <div className="main-margin bg-[#f7f7f7] ">
      <Head>
        <title>Thiasil | Individually oxy-fired laboratory glassware</title>
        <meta
          name="description"
          content="Manufacturers of individually oxy-fired laboratory glassware including crucibles, lids, basin"
          key="desc"
        />
        <meta 
            name="keywords" 
              content="crucible, lid, quartz, silica, gooch crucible, muffle stand, volatile matter, circular capsule, boats combustion, triangles on nichrome wire" 
        />
      </Head>
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
