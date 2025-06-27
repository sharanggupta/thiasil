import Image from "next/image";
import scientistImage from "../../images/thiasil-3.webp";
import labEquipmentImage from "../../images/thiasil-4.webp";
import industryWorkerImage from "../../images/thiasil-5.webp";
import Heading from "../common/Heading";
import "./HiTechSection.css"; // Hover effects and z-index styles

const HiTechSection = () => {
  return (
    <div className="mt-10 md:mt-28 mb-5 md:mb-10 px-7 md:px-10 flex flex-col items-center h-[40rem]">
      <Heading as="h2" className="text-center mb-10 md:mb-28" size="primary">
        HI-TECH RANGE FOR EVERY APPLICATION
      </Heading>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between w-full text-custom-gray gap-10">
        {/* Left Side - Text */}
        <div className="w-full lg:w-1/2 pr-0 md:pr-10  md:px-0">
          <h3 className="font-bold text-sm md:text-base mb-4">
            QUALITY RIVALLING INTERNATIONAL STANDARDS
          </h3>
          <p className="text-sm md:text-base  leading-6 md:leading-7 mb-6">
            Thiasil Fused Silica Laboratory Wares are manufactured from
            indigenous raw material using a unique process developed in India.
            Since its inception Thiasil has always endeavored to perform at
            elevated levels of capability, owing to sound research development
            and timely upgradation of technology undertaken by us.
          </p>
          <h3 className="font-bold text-sm md:text-base mb-4">
            RIGOROUSLY TESTED AND WIDELY USED
          </h3>
          <p className="text-sm md:text-base leading-6 md:leading-7 mb-6">
            Thiasil products have been tested and are used by several leading
            research institutions, quality control laboratories, industrial
            testing, and analytical laboratories all over India. Each product is
            individually oxy-gas fired and rigorously tested, consequently
            resulting in slight variation in shape but ensuring high purity and
            performance.
          </p>
          <a href="#" className="custom-link text-custom-blue">
            Learn more →
          </a>
        </div>

        {/* Right Side - Images with Hover Effect */}
        <div className="flex md:flex-col justify-center w-full md:w-1/2 space-y-6 relative " id="thiasil-benefits">
          {/* Gradient overlay for brand consistency, semi-transparent */}
          <div className="absolute inset-0 pointer-events-none z-20" style={{ background: 'var(--primary-gradient)', opacity: 0.7, borderRadius: '2px' }} />
          <Image
            src={scientistImage}
            alt="Scientist Image"
            className="absolute image-hover-effect left-0 top-0"
          />
          <Image
            src={labEquipmentImage}
            alt="Lab Equipment"
            className="absolute top-[-2.4rem] md:top-[1rem] md:right-[-0.3rem]  image-hover-effect"
          />
          <Image
            src={industryWorkerImage}
            alt="Industry Worker"
            className="absolute top-[-1.3rem] md:top-[6rem] right-0 md:left-[20%]   image-hover-effect"
          />
        </div>
      </div>
    </div>
  );
};

export default HiTechSection;
