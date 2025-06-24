"use client";
import { useState } from "react";
import Modal from "../../components/Modals/Modal";
import Button from "../MainButton/Button";
import "./ProductCardSection.css";

const ProductCardSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div
      className="flex flex-col justify-center gap-8 px-10 h-auto my-24"
      id="popular-products"
    >
      <h2 className="text-center heading mb-10">Most Popular Products</h2>
      <div className="flex flex-col custom-mobile:flex-row items-center justify-center gap-16">
        {/* Card 1 */}
        <div className="group w-[339px] h-[540px] perspective">
          <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
            {/* Front side */}
            <div className="absolute w-full h-full rounded-lg shadow-2xl backface-hidden bg-white">
              <div className="gradient-div-card1 card__picture"></div>
              <div className="absolute text-right top-[7rem] right-0">
                <h3 className="text-[#ffffff] flex flex-col text-lg md:text-3xl mr-5">
                  <span className="card-heading-1 self-end w-fit">
                    CRUCIBLE
                  </span>
                  <span className="card-heading-1_1">REGULAR FORM</span>
                </h3>
              </div>
              <div className="text-custom-gray text-center mt-12 text-sm md:text-base">
                <p className="mt-2 border-b p-2 md:p-3 mx-10">
                  capacity: 15 to 250 ml
                </p>
                <p className="border-b p-2 md:p-3 mx-10">
                  packaging: 6 to 36 pieces
                </p>
                <p className="border-b p-2 md:p-3 mx-10">
                  pricing: varies with size
                </p>
              </div>
            </div>
            {/* Card CTA for mobile screens */}
            <div
              className="card-cta-mobile card-cta-1 absolute bottom-0 w-full  bg-black"
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 0 19%)" }}
            >
              <div className="flex flex-col justify-center items-center h-full p-8">
                <p className="text-white text-sm font-semibold mb-2">
                  Starts From
                </p>
                <h1 className="text-white text-2xl flex flex-col font-extralight text-center mb-4 ">
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
            <div className="absolute w-full h-full rounded-sm shadow-2xl backface-hidden  rotate-y-180 card1-backSide">
              <div className="flex flex-col justify-center items-center h-full p-8">
                <p className="text-white text-lg font-semibold mb-4">
                  Starts From
                </p>
                <h1 className="text-white text-7xl flex flex-col font-extralight text-center mb-24">
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
            <div className="absolute w-full h-full rounded-lg shadow-2xl backface-hidden bg-white">
              <div className="gradient-div-card2 card__picture"></div>
              <div className="absolute text-right top-[7rem] right-0">
                <h3 className="text-[#ffffff] flex flex-col text-lg md:text-3xl mr-5">
                  <span className="card-heading-2">LIDZ QUARTZ</span>
                  <span className="card-heading-2_1 self-end w-fit">
                    SILICA
                  </span>
                </h3>
              </div>
              <div className="text-custom-gray text-center mt-12 text-sm md:text-base">
                <p className="mt-2 border-b p-2 md:p-3 mx-10">
                  capacity: 15 to 250 ml
                </p>
                <p className="border-b p-2 md:p-3 mx-10">
                  packaging: 6 to 36 pieces
                </p>
                <p className="border-b p-2 md:p-3 mx-10">
                  pricing: varies with size
                </p>
              </div>
            </div>
            {/* Card CTA for mobile screens */}
            <div
              className="card-cta-mobile card-cta-2 absolute bottom-0 w-full  bg-black"
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 0 19%)" }}
            >
              <div className="flex flex-col justify-center items-center h-full p-8">
                <p className="text-white text-sm font-semibold mb-2">
                  Starts From
                </p>
                <h1 className="text-white text-2xl flex flex-col font-extralight text-center mb-4 ">
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
            <div className=" absolute w-full h-full rounded-sm shadow-2xl backface-hidden  rotate-y-180 card2-backSide">
              <div className="flex flex-col justify-center items-center h-full p-8">
                <p className="text-white text-lg font-semibold mb-4">
                  Starts From
                </p>
                <h1 className="text-white text-7xl flex flex-col font-extralight text-center mb-24">
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
            <div className="absolute w-full h-full rounded-lg shadow-2xl backface-hidden bg-white">
              <div className="gradient-div-card3 card__picture"></div>
              <div className="absolute text-right top-[7rem] right-0">
                <h3 className="text-[#ffffff] flex flex-col text-lg md:text-3xl mr-5">
                  <span className="card-heading-3">CRUCIBLE TALL</span>
                  <span className="card-heading-3_1 self-end w-fit">FORM</span>
                </h3>
              </div>
              <div className="text-custom-gray text-center mt-12 text-sm md:text-base">
                <p className="mt-2 border-b p-2 md:p-3 mx-10">
                  capacity: 15 to 50 ml
                </p>
                <p className="border-b p-2 md:p-3 mx-10">
                  packaging: 15 to 30 pieces
                </p>
                <p className="border-b p-2 md:p-3 mx-10">
                  pricing: varies with size
                </p>
              </div>
            </div>

            {/* Card CTA for mobile screens */}
            <div
              className="card-cta-mobile card-cta-3 absolute bottom-0 w-full  bg-black"
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 0 19%)" }}
            >
              <div className="flex flex-col justify-center items-center h-full p-8">
                <p className="text-white text-sm font-semibold mb-2">
                  Starts From
                </p>
                <h1 className="text-white text-2xl flex flex-col font-extralight text-center mb-4 ">
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
            <div className="absolute w-full h-full rounded-sm shadow-2xl backface-hidden  rotate-y-180 card3-backSide">
              <div className="flex flex-col justify-center items-center h-full p-8">
                <p className="text-white text-lg font-semibold mb-4">
                  Starts From
                </p>
                <h1 className="text-white text-7xl flex flex-col font-extralight text-center mb-24">
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

      <div className="flex items-center justify-center">
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
