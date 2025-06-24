"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Modal from "../../components/Modals/Modal";
import Heading from "../common/Heading";
import Button from "../MainButton/Button";
import "./ProductCardSection.css";

const ProductCardSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = [
    {
      id: "1130",
      category: "crucibles",
      categorySlug: "crucibles",
      catNo: "1100 Series",
      name: "Crucible Regular Form",
      imageUrl: "/images/products/1130.png",
      headings: ["CRUCIBLE", "REGULAR FORM"],
      capacity: "15 to 250 ml",
      packaging: "6 to 36 pieces",
      cardClass: "card-heading-1 card-heading-1_1 card-cta-1 card1-backSide gradient-div-card1",
    },
    {
      id: "1140",
      category: "crucibles",
      categorySlug: "crucibles",
      catNo: "1140 Series",
      name: "Basin with Spout Fused Silica",
      imageUrl: "/images/products/1140.png",
      headings: ["BASIN WITH SPOUT", "FUSED SILICA"],
      capacity: "5 to 12 pieces",
      packaging: "2 to 250 ml",
      cardClass: "card-heading-2 card-heading-2_1 card-cta-2 card2-backSide gradient-div-card2",
    },
    {
      id: "1150",
      category: "crucibles",
      categorySlug: "crucibles",
      catNo: "1150 Series",
      name: "Crucible Tall Form",
      imageUrl: "/images/products/1150.png",
      headings: ["CRUCIBLE TALL", "FORM"],
      capacity: "15 to 50 ml",
      packaging: "15 to 30 pieces",
      cardClass: "card-heading-3 card-heading-3_1 card-cta-3 card3-backSide gradient-div-card3",
    },
  ];

  return (
    <div
      className="flex flex-col justify-center gap-8 px-10 h-auto my-24"
      id="popular-products"
    >
      <Heading as="h2" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="text-center mb-10" size="primary">
        Most Popular Products
      </Heading>
      <div className="flex flex-col custom-mobile:flex-row items-center justify-center gap-16">
        {products.map((product, idx) => (
          <Link
            href={`/products/${product.categorySlug}/${encodeURIComponent(product.catNo)}`}
            key={product.id}
            className="group w-[339px] h-[540px] perspective"
          >
            <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
              {/* Front side */}
              <div className="absolute w-full h-full rounded-lg shadow-2xl backface-hidden bg-white">
                <div className={`card__picture flex justify-center items-center w-full h-48 rounded-t-lg gradient-div-card${idx + 1}`}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="object-contain w-full h-32"
                  />
                </div>
                <div className="absolute text-right top-[7rem] right-0">
                  <h3 className="text-[#ffffff] flex flex-col text-lg md:text-3xl mr-5">
                    <span className={product.cardClass.split(' ')[0] + ' self-end w-fit'}>
                      {product.headings[0]}
                    </span>
                    <span className={product.cardClass.split(' ')[1]}>{product.headings[1]}</span>
                  </h3>
                </div>
                <div className="text-custom-gray text-center mt-12 text-sm md:text-base">
                  <p className="mt-2 border-b p-2 md:p-3 mx-10">
                    capacity: {product.capacity}
                  </p>
                  <p className="border-b p-2 md:p-3 mx-10">
                    packaging: {product.packaging}
                  </p>
                  <p className="border-b p-2 md:p-3 mx-10">
                    pricing: varies with size
                  </p>
                </div>
              </div>
              {/* Card CTA for mobile screens */}
              <div
                className={`card-cta-mobile ${product.cardClass.split(' ')[2]} absolute bottom-0 w-full bg-black`}
                style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 0 19%)" }}
              >
                <div className="flex flex-col justify-center items-center h-full p-8">
                  <Button
                    name="Buy Now!"
                    color="#777777"
                    bgColor="#ffffff"
                    textSize="text-[10px] md:text-base"
                    padding="px-7 md:px-10 py-3 md:py-5"
                    onClick={e => { e.preventDefault(); setIsModalOpen(true); }}
                  />
                </div>
              </div>
              {/* Back side */}
              <div className={`absolute w-full h-full rounded-sm shadow-2xl backface-hidden rotate-y-180 ${product.cardClass.split(' ')[3]}`}>
                <div className="flex flex-col justify-center items-center h-full p-8">
                  <Button
                    name="Buy Now!"
                    color="#777777"
                    bgColor="#ffffff"
                    textSize="text-sm md:text-base"
                    padding="px-7 md:px-10 py-3 md:py-5"
                    onClick={e => { e.preventDefault(); setIsModalOpen(true); }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Get a Quote</h2>
          <p className="mb-4">Please contact us for a quote on this product.</p>
          <Button name="Close" onClick={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </div>
  );
};

export default ProductCardSection;
