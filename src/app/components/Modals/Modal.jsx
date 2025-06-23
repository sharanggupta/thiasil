"use client";
import Image from "next/image";
import image1 from "../../images/thiasil-10.jpg";
import image2 from "../../images/thiasil-11.jpg";
import Button from "../MainButton/Button";

export default function Modal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 "
      aria-hidden={!isOpen}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 md:mx-6 overflow-hidden">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 focus:outline-none"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="">
          <div className="flex flex-col md:flex-row md:gap-6 gap-4 items-center md:items-start ">
            {/* Images */}
            <div className="flex flex-row md:flex-col md:items-center md:w-1/3 md:space-y-0">
              <div className=" w-[10rem] h-[10rem] md:w-full md:h-auto flex-shrink-0">
                <Image
                  src={image1}
                  alt="Scientist"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className=" w-[10rem] h-[10rem] md:w-full md:h-auto flex-shrink-0">
                <Image
                  src={image2}
                  alt="Smiling Man"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-left w-full md:w-2/3 p-6">
              <h2 className="text-lg md:text-xl font-bold heading">
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

              <div className="flex justify-center md:justify-start mt-6">
                <Button
                  name="Book Now!"
                  color="#ffff"
                  bgColor="#2196f3"
                  textSize="text-[10px] md:text-base"
                  padding="px-7 md:px-6 py-3 md:py-4"
                  href="#order-now"
                  onClick={() => onClose()} // Close modal on click
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
