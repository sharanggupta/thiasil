import logoImage from "../../images/thiasil-1.webp";
import backgroundImage from "../../images/thiasil-2.webp";
import HeroBackground from "./HeroBackground";
import HeroLogo from "./HeroLogo";
import HeroContent from "./HeroContent";
import "./Hero.css";

const HeroSection = () => {
  return (
    <div className="relative h-screen" id="home">
      <HeroBackground backgroundImage={backgroundImage} />
      <HeroLogo logoImage={logoImage} />
      <HeroContent />
    </div>
  );
};

export default HeroSection;
