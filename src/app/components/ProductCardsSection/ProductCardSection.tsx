"use client";
import { useState } from "react";
import Modal from "../../components/Modals/Modal";
import Button from "../MainButton/Button";
import "./ProductCardSection.css";

const ProductCardSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div
      className="flex flex-col gap-8 justify-center px-10 my-24 h-auto"
      id="popular-products"
    >
      <h2 className="mb-10 text-center heading">Most Popular Products</h2>
      <div className="flex flex-col gap-16 justify-center items-center custom-mobile:flex-row">
        {/* Card 1 */}
        <div className="group w-[339px] h-[540px] perspective">
          <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
            {/* Front side */}
            <div className="absolute w-full h-full bg-white rounded-lg shadow-2xl backface-hidden">
              <div className="gradient-div-card1 card__picture"></div>
              <div className="absolute text-right top-[7rem] right-0">
                <h3 className="text-[#ffffff] flex flex-col text-lg md:text-3xl mr-5">
                  <span className="self-end card-heading-1 w-fit">
                    CRUCIBLE
                  </span>
                  <span className="card-heading-1_1">REGULAR FORM</span>
                </h3>
              </div>
              <div className="mt-12 text-sm text-center text-custom-gray md:text-base">
                <p className="p-2 mx-10 mt-2 border-b md:p-3">
                  capacity: 15 to 250 ml
                </p>
                <p className="p-2 mx-10 border-b md:p-3">
                  packaging: 6 to 36 pieces
                </p>
                <p className="p-2 mx-10 border-b md:p-3">
                  pricing: varies with size
                </p>
              </div>
            </div>
            {/* Card CTA for mobile screens */}
            <div
              className="absolute bottom-0 w-full bg-black card-cta-mobile card-cta-1"
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 0 19%)" }}
            >
              <div className="flex flex-col justify-center items-center p-8 h-full">
                <p className="mb-2 text-sm font-semibold text-white">
                  Starts From
                </p>
                <h1 className="flex flex-col mb-4 text-2xl font-extralight text-center text-white">
                  300 per piece
                </h1>

                <Button
                  name="Buy Now!"
                  color="#777777"
                  bgColor="#ffffff"
                  textSize="text-[10px] md:text-base"
                  padding="px-7 md:px-10 py-3 md:py-5"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>

            {/* Back side */}
            <div className="absolute w-full h-full rounded-sm shadow-2xl backface-hidden rotate-y-180 card1-backSide">
              <div className="flex flex-col justify-center items-center p-8 h-full">
                <p className="mb-4 text-lg font-semibold text-white">
                  Starts From
                </p>
                <h1 className="flex flex-col mb-24 text-7xl font-extralight text-center text-white">
                  300 per <br /> <span className="mt-10"> piece</span>{" "}
                </h1>

                <Button
                  name="Buy Now!"
                  color="#777777"
                  bgColor="#ffffff"
                  textSize="text-sm md:text-base"
                  padding="px-7 md:px-10 py-3 md:py-5"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group w-[339px] h-[540px] perspective">
          <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
            {/* Front side */}
            <div className="absolute w-full h-full bg-white rounded-lg shadow-2xl backface-hidden">
              <div className="gradient-div-card2 card__picture"></div>
              <div className="absolute text-right top-[7rem] right-0">
                <h3 className="text-[#ffffff] flex flex-col text-lg md:text-3xl mr-5">
                  <span className="card-heading-2">LIDS QUARTZ</span>
                  <span className="self-end card-heading-2_1 w-fit">
                    SILICA
                  </span>
                </h3>
              </div>
              <div className="mt-12 text-sm text-center text-custom-gray md:text-base">
                <p className="p-2 mx-10 mt-2 border-b md:p-3">
                  capacity: 15 to 250 ml
                </p>
                <p className="p-2 mx-10 border-b md:p-3">
                  packaging: 6 to 36 pieces
                </p>
                <p className="p-2 mx-10 border-b md:p-3">
                  pricing: varies with size
                </p>
              </div>
            </div>
            {/* Card CTA for mobile screens */}
            <div
              className="absolute bottom-0 w-full bg-black card-cta-mobile card-cta-2"
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 0 19%)" }}
            >
              <div className="flex flex-col justify-center items-center p-8 h-full">
                <p className="mb-2 text-sm font-semibold text-white">
                  Starts From
                </p>
                <h1 className="flex flex-col mb-4 text-2xl font-extralight text-center text-white">
                  300 per piece
                </h1>

                <Button
                  name="Buy Now!"
                  color="#777777"
                  bgColor="#ffffff"
                  textSize="text-[10px] md:text-base"
                  padding="px-7 md:px-10 py-3 md:py-5"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>

            {/* Back side */}
            <div className="absolute w-full h-full rounded-sm shadow-2xl backface-hidden rotate-y-180 card2-backSide">
              <div className="flex flex-col justify-center items-center p-8 h-full">
                <p className="mb-4 text-lg font-semibold text-white">
                  Starts From
                </p>
                <h1 className="flex flex-col mb-24 text-7xl font-extralight text-center text-white">
                  300 per <br /> <span className="mt-10"> piece</span>{" "}
                </h1>

                <Button
                  name="Buy Now!"
                  color="#777777"
                  bgColor="#ffffff"
                  textSize="text-sm md:text-base"
                  padding="px-7 md:px-10 py-3 md:py-5"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group w-[339px] h-[540px] perspective">
          <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
            {/* Front side */}
            <div className="absolute w-full h-full bg-white rounded-lg shadow-2xl backface-hidden">
              <div className="gradient-div-card3 card__picture"></div>
              <div className="absolute text-right top-[7rem] right-0">
                <h3 className="text-[#ffffff] flex flex-col text-lg md:text-3xl mr-5">
                  <span className="card-heading-3">CRUCIBLE TALL</span>
                  <span className="self-end card-heading-3_1 w-fit">FORM</span>
                </h3>
              </div>
              <div className="mt-12 text-sm text-center text-custom-gray md:text-base">
                <p className="p-2 mx-10 mt-2 border-b md:p-3">
                  capacity: 15 to 50 ml
                </p>
                <p className="p-2 mx-10 border-b md:p-3">
                  packaging: 15 to 30 pieces
                </p>
                <p className="p-2 mx-10 border-b md:p-3">
                  pricing: varies with size
                </p>
              </div>
            </div>

            {/* Card CTA for mobile screens */}
            <div
              className="absolute bottom-0 w-full bg-black card-cta-mobile card-cta-3"
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 0 19%)" }}
            >
              <div className="flex flex-col justify-center items-center p-8 h-full">
                <p className="mb-2 text-sm font-semibold text-white">
                  Starts From
                </p>
                <h1 className="flex flex-col mb-4 text-2xl font-extralight text-center text-white">
                  350 per piece
                </h1>

                <Button
                  name="Buy Now!"
                  color="#777777"
                  bgColor="#ffffff"
                  textSize="text-[10px] md:text-base"
                  padding="px-7 md:px-10 py-3 md:py-5"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>
            {/* Back side */}
            <div className="absolute w-full h-full rounded-sm shadow-2xl backface-hidden rotate-y-180 card3-backSide">
              <div className="flex flex-col justify-center items-center p-8 h-full">
                <p className="mb-4 text-lg font-semibold text-white">
                  Starts From
                </p>
                <h1 className="flex flex-col mb-24 text-7xl font-extralight text-center text-white">
                  350 per <br /> <span className="mt-10"> piece</span>{" "}
                </h1>

                <Button
                  name="Buy Now!"
                  color="#777777"
                  bgColor="#ffffff"
                  textSize="text-[10px] md:text-base"
                  padding="px-7 md:px-10 py-3 md:py-5"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <Button
          name="Discover our products"
          color="#ffff"
          bgColor="#2196f3"
          textSize="text-sm md:text-base"
          padding="px-8 md:px-10 py-4 md:py-5"
          className="mt-14"
          href="/products"
        />
      </div>
      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProductCardSection;