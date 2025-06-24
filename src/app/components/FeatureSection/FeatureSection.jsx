import Image from "next/image";
import backgroundImage from "../../images/thiasil-6.webp";
import Heading from "../common/Heading";
import "./FeatureSection.css";

const FeatureSection = () => {
  return (
    <div className="">
      <div className="relative px-4 md:px-10 mt-[10rem] md:mt-0 flex items-center justify-center Feature-section">
        {/* Background image with clip-path */}
        <div className="absolute inset-0 w-full h-full bg-image-clip-path">
          <Image
            src={backgroundImage}
            alt="Lab Background"
            fill
            className="object-cover"
            quality={100}
          />
          {/* Gradient overlay with clip-path */}
          <div className="absolute inset-0 w-full h-full bg-gradient-clip-path-features"></div>
        </div>

        {/* Content */}
        <div className="">
          <div className="flex flex-col md:gap-10 lg:gap-0 custom-mobile:flex-row items-center justify-between space-y-10 md:space-y-0 lg:space-x-16 w-full mx-auto">
            {/* Coefficient of Expansion */}
            <div className="flex flex-col items-center card bg-white opacity-80 shadow-lg p-4 rounded-md text-center w-[16rem] lg:w-48 h-[10rem] md:h-56 ">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                <path d="M20 6v28M6 20h28" stroke="#3a8fff" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <Heading as="h3" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-1 text-base md:text-lg" size="tertiary">
                COEFFICIENT OF EXPANSION
              </Heading>
              <p className="text-custom-gray text-sm md:text-base leading-6 text-center">
                Miniscule Coefficient of Expansion of only{" "}
                <span className="font-semibold">0.6 × 10⁻⁶</span> per °Celsius.
              </p>
            </div>

            {/* Chemical Resistance */}
            <div className="flex flex-col items-center card bg-white opacity-80 shadow-lg p-4 rounded-md text-center w-[16rem] lg:w-48 h-[10rem] md:h-56">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                <path d="M12 6h16M20 6v20M14 26c0 4 4 8 6 8s6-4 6-8V10H14v16z" stroke="#3a8fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <rect x="16" y="30" width="8" height="4" rx="2" fill="#3a8fff" />
              </svg>
              <Heading as="h3" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-1 text-base md:text-lg" size="tertiary">
                CHEMICAL RESISTANCE
              </Heading>
              <p className="text-custom-gray text-sm md:text-base leading-6 text-center">
                <span className="font-semibold">Inert</span> to most substances<span className="font-semibold">*</span>
              </p>
            </div>

            {/* Heat Resistance */}
            <div className="flex flex-col items-center card bg-white opacity-80 shadow-lg p-4 rounded-md text-center w-[16rem] lg:w-48 h-[10rem] md:h-56">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                <path d="M20 10v20M10 30c0-5 10-5 10-10V10" stroke="#3a8fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
              <Heading as="h3" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-1 text-base md:text-lg" size="tertiary">
                HEAT RESISTANCE
              </Heading>
              <p className="text-custom-gray text-sm md:text-base leading-6 text-center">
                High tolerance for heat up to temperature{" "}
                <span className="font-semibold">1050°C</span>.
              </p>
            </div>

            {/* Electric Resistance */}
            <div className="flex flex-col items-center card bg-white opacity-80 shadow-lg p-4 rounded-md text-center w-[16rem] lg:w-48 h-[10rem] md:h-56">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                <circle cx="20" cy="20" r="18" stroke="#3a8fff" strokeWidth="2" fill="none"/>
                <path d="M20 10v10M20 20l-5 10M20 20l5 10" stroke="#3a8fff" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <Heading as="h3" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-1 text-base md:text-lg" size="tertiary">
                ELECTRIC RESISTANCE
              </Heading>
              <p className="text-custom-gray text-sm md:text-base leading-6 text-center">
                High dielectric constant and resistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
