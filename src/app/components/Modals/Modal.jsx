'use client'
import { useState } from "react";
import Image from "next/image";
import image1 from "../../images/thiasil-10.jpg";
import image2 from "../../images/thiasil-11.jpg";

export default function Modal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-xl">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
           onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Images */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-[120px] h-[120px] rounded-md overflow-hidden">
                <Image
                  src={image1} // Replace with your image path
                  alt="Scientist"
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                />
              </div>
              <div className="relative w-[120px] h-[120px] rounded-md overflow-hidden">
                <Image
                  src={image2} // Replace with your image path
                  alt="Smiling Man"
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-blue-600">
                PLACE ORDER NOW
              </h2>
              <p className="text-sm text-gray-700 mt-4 font-medium">
                IMPORTANT – PLEASE READ THESE TERMS BEFORE BOOKING
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-2">
                <li>1) Price net EXX-WORKS Mumbai.</li>
                <li>2) Packaging and forwarding extra at actual.</li>
                <li>3) Taxes extra as applicable.</li>
                <li>4) Delivery generally from ready stock.</li>
                <li>
                  5) Payment against delivery subject to Mumbai jurisdiction.
                </li>
                <li>6) Insurances to be arranged by buyer.</li>
                <li>7) Capacity mentioned is maximum overflow capacity.</li>
              </ul>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center mt-6">
            <button className="px-6 py-2 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700">
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
