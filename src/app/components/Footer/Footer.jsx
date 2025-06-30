"use client";

import { useState } from "react";
import Modal from "@/app/components/Modals/Modal";
import FooterLogo from "./FooterLogo";
import FooterDescription from "./FooterDescription";
import FooterNavigation from "./FooterNavigation";
import FooterContact from "./FooterContact";
import FooterDisclaimer from "./FooterDisclaimer";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer role="contentinfo" aria-label="Site Footer" className="bg-[#333333] text-white px-5 md:px-10 py-10 h-auto">
      <div className="flex flex-col justify-between items-center">
        <FooterLogo />
        <FooterDescription />
        
        <div className="flex flex-col justify-between items-center w-full md:flex-row md:items-start">
          <FooterNavigation onTermsClick={() => setIsModalOpen(true)} />
          <FooterContact />
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <FooterDisclaimer />
    </footer>
  );
}
