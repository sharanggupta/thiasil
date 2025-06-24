"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "../../images/thiasil-13.webp"; // Replace with your logo image path
import Modal from "../Modals/Modal";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="bg-[#333333] text-white px-5 md:px-10 py-10 h-auto">
      <div className="flex flex-col items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-8">
          <Image
            src={logo}
            alt="Thiasil Logo"
            className="w-20 md:w-[7rem]"
          />
        </div>

        {/* Company Description */}
        <div className="text-center mb-8 max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Thiasil Labware</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Manufacturers of individually oxy-fired laboratory glassware including crucibles, lids, basins, and specialty lab equipment. 
            Premium quality fused silica products for research institutions, quality control laboratories, and analytical laboratories.
          </p>
        </div>

        {/* Navigation and Info Section */}
        <div className="flex flex-col md:flex-row items-start justify-between w-full">
          {/* Navigation Links */}
          <div className="flex flex-wrap text-center items-center justify-center text-nowrap space-x-4 text-sm uppercase border-t-2 pt-4 mb-6 md:mb-0">
            <Link
              href="/"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              Home
            </Link>
            <Link
              href="/company"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              About Us
            </Link>
            <Link
              href="/products"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              Products
            </Link>
            <Link
              href="/contact"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              Contact
            </Link>
            <Link
              href="/policy"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              Privacy Policy
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:rotate-6 uppercase hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              Terms
            </button>
          </div>

          {/* Contact Information */}
          <div className="w-full md:w-1/3 text-sm border-t-2 pt-4 md:mt-0 mt-6">
            <h4 className="font-semibold mb-3">Contact Information</h4>
            <div className="space-y-2 text-gray-300">
              <p>📞 Phone: +91 9820576045</p>
              <p>📧 Email: info@thiasil.com</p>
              <p>📍 Location: India</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-xs text-gray-400">
                © 2024 Thiasil Labware. All rights reserved. 
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
