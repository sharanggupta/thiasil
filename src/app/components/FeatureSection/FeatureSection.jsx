import React from "react";
import backgroundImage from "../../images/service-bg.webp";
import Image from "next/image";
import "./FeatureSection.css";

const FeatureSection = () => {
  return (
    <div className="relative h-[70rem] md:h-[50rem] px-4 md:px-10 flex items-center justify-center mt-[10rem] md:mt-0">
      {/* Background image with clip-path */}
      <div
        className="absolute inset-0 w-full h-full bg-image-clip-path"
        
      >
        <Image
          src={backgroundImage}
          alt="Lab Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        {/* Gradient overlay with clip-path */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-clip-path-features"
         
        ></div>
      </div>

      {/* Content */}
      <div className="">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0 md:space-x-16 w-full mx-auto">
          {/* Coefficient of Expansion */}
          <div className="flex flex-col items-center card bg-white opacity-80 shadow-lg p-6 rounded-md text-center w-[20rem] md:w-60 h-[12rem] md:h-72 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="feature-box__icon"
             
              fill="url(#gradient1)"
            >
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#009ffd", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#2a2a72", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8l-144 0c-13.3 0-24-10.7-24-24l0-144c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272l144 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z" />
            </svg>
            <h2 className=" text-sm md:text-base text-custom-gray font-semibold leading-7 mb-2">
              COEFFICIENT OF EXPANSION
            </h2>
            <p className="text-custom-gray text-sm md:text-base leading-6 text-center">
              Miniscule Coefficient of Expansion of only{" "}
              <span className="font-semibold">0.6 × 10⁻⁶</span> per °Celsius.
            </p>
          </div>

          {/* Chemical Resistance */}
          <div className="flex flex-col items-center card bg-white opacity-80 shadow-lg p-6 rounded-md text-center w-[20rem] md:w-60 h-[12rem] md:h-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="feature-box__icon"
             
              fill="url(#gradient1)"
            >
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#009ffd", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#2a2a72", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M288 0L160 0 128 0C110.3 0 96 14.3 96 32s14.3 32 32 32l0 132.8c0 11.8-3.3 23.5-9.5 33.5L10.3 406.2C3.6 417.2 0 429.7 0 442.6C0 480.9 31.1 512 69.4 512l309.2 0c38.3 0 69.4-31.1 69.4-69.4c0-12.8-3.6-25.4-10.3-36.4L329.5 230.4c-6.2-10.1-9.5-21.7-9.5-33.5L320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32L288 0zM192 196.8L192 64l64 0 0 132.8c0 23.7 6.6 46.9 19 67.1L309.5 320l-171 0L173 263.9c12.4-20.2 19-43.4 19-67.1z" />
            </svg>
            <h2 className="text-sm md:text-base text-custom-gray font-semibold leading-7 mb-2">
              CHEMICAL RESISTANCE
            </h2>
            <p className="text-custom-gray text-sm md:text-base leading-6 text-center">
              Inert to most substances except alkalis, phosphate, and fluorine
              compounds at an elevated temperature.
            </p>
          </div>

          {/* Heat Resistance */}
          <div className="flex flex-col items-center card bg-white opacity-80 shadow-lg p-6 rounded-md text-center w-[20rem] md:w-60 h-[12rem] md:h-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="feature-box__icon"
              
              fill="url(#gradient1)"
            >
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#009ffd", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#2a2a72", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M153.6 29.9l16-21.3C173.6 3.2 180 0 186.7 0C198.4 0 208 9.6 208 21.3V43.5c0 13.1 5.4 25.7 14.9 34.7L307.6 159C356.4 205.6 384 270.2 384 337.7C384 434 306 512 209.7 512H192C86 512 0 426 0 320v-3.8c0-48.8 19.4-95.6 53.9-130.1l3.5-3.5c4.2-4.2 10-6.6 16-6.6C85.9 176 96 186.1 96 198.6V288c0 35.3 28.7 64 64 64s64-28.7 64-64v-3.9c0-18-7.2-35.3-19.9-48l-38.6-38.6c-24-24-37.5-56.7-37.5-90.7c0-27.7 9-54.8 25.6-76.9z" />
            </svg>
            <h2 className="text-sm md:text-base text-custom-gray font-semibold leading-7 mb-2">
              HEAT RESISTANCE
            </h2>
            <p className="text-custom-gray text-sm md:text-base leading-6 text-center">
              High tolerance for heat up to temperature{" "}
              <span className="font-semibold">1050°C</span>.
            </p>
          </div>

          {/* Electric Resistance */}
          <div className="flex flex-col items-center card bg-white opacity-80 shadow-lg p-6 rounded-md text-center w-[20rem] md:w-60 h-[12rem] md:h-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="feature-box__icon"
                fill="url(#gradient1)"
            >
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#009ffd", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#2a2a72", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z" />
            </svg>
            <h2 className="text-sm md:text-base text-custom-gray font-semibold leading-7 mb-2">
              ELECTRIC RESISTANCE
            </h2>
            <p className="text-custom-gray text-sm md:text-base leading-6 text-center">
              High dielectric constant and consequently high electric resistance
              even at elevated temperatures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
