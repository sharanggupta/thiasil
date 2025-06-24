"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "../../images/thiasil-13.webp"; // Replace with your logo image path
import Modal from "../Modals/Modal";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer role="contentinfo" aria-label="Site Footer" className="bg-[#333333] text-white px-5 md:px-10 py-10 h-auto">
      <div className="flex flex-col justify-between items-center">
        {/* Logo Section */}
        <div className="flex justify-center items-center mb-8">
          <Image
            src={logo}
            alt="Thiasil Logo"
            className="w-20 md:w-[7rem]"
          />
        </div>

        {/* Company Description */}
        <div className="mb-8 max-w-2xl text-center">
          <h3 className="mb-4 text-xl font-semibold">Thiasil</h3>
          <p className="text-sm leading-relaxed text-gray-300">
            Manufacturers of individually oxy-fired laboratory glassware including crucibles, lids, basins, and specialty lab equipment. 
            Premium quality fused silica products for research institutions, quality control laboratories, and analytical laboratories.
          </p>
        </div>

        {/* Navigation and Info Section */}
        <div className="flex flex-col justify-between items-center w-full md:flex-row md:items-start">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center items-center pt-4 mb-6 space-x-4 text-sm text-center uppercase border-t-2 text-nowrap md:mb-0">
            <Link
              href="/"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative focus:outline-none focus:ring-2 focus:ring-[#3a8fff]"
            >
              Home
            </Link>
            <Link
              href="/company"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative focus:outline-none focus:ring-2 focus:ring-[#3a8fff]"
            >
              About Us
            </Link>
            <Link
              href="/products"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative focus:outline-none focus:ring-2 focus:ring-[#3a8fff]"
            >
              Products
            </Link>
            <Link
              href="/contact"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative focus:outline-none focus:ring-2 focus:ring-[#3a8fff]"
            >
              Contact
            </Link>
            <Link
              href="/policy"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative focus:outline-none focus:ring-2 focus:ring-[#3a8fff]"
            >
              Privacy Policy
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:rotate-6 uppercase hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative focus:outline-none focus:ring-2 focus:ring-[#3a8fff]"
            >
              Terms
            </button>
          </div>

          {/* Contact Information */}
          <div className="pt-4 mt-6 w-full text-sm border-t-2 md:w-1/3 md:mt-0">
            <h4 className="mb-3 font-semibold">Contact Information</h4>
            <div className="space-y-2 text-gray-300">
              <p>📞 Phone: +91 9820576045</p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-600">
              <p className="text-xs text-gray-400">
                © 2025 Thiasil. All rights reserved. 
                Premium laboratory equipment and supplies.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  );
}
