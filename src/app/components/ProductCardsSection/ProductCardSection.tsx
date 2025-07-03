"use client";
import { useState } from "react";
import Modal from "../../components/Modals/Modal";
import Button from "../MainButton/Button";
import { ProductCardsGrid, PRODUCT_CARDS } from "./components";
import "./ProductCardSection.css";

const ProductCardSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyNow = () => {
    setIsModalOpen(true);
  };

  return (
    <div
      className="flex flex-col gap-8 justify-center px-10 my-24 h-auto"
      id="popular-products"
    >
      <h2 className="mb-10 text-center heading">Most Popular Products</h2>
      
      <ProductCardsGrid 
        cards={PRODUCT_CARDS} 
        onBuyNow={handleBuyNow} 
      />

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