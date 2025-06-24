"use client";
import Image from "next/image";
import image1 from "../../images/thiasil-10.jpg";
import image2 from "../../images/thiasil-11.jpg";
import Button from "../MainButton/Button";

export default function Modal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="flex fixed inset-0 z-50 justify-center items-center transition-opacity duration-300 bg-black/40"
      aria-hidden={!isOpen}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <div className="relative p-8 w-full max-w-lg bg-white rounded-2xl shadow-xl" tabIndex={0}>
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3a8fff]"
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Modal content */}
        <div className="">
          <div className="flex flex-col gap-4 items-center md:flex-row md:gap-6 md:items-start">
            {/* Images */}
            <div className="flex flex-row md:flex-col md:items-center md:w-1/3 md:space-y-0">
              <div className=" w-[10rem] h-[10rem] md:w-full md:h-auto flex-shrink-0">
                <Image
                  src={image1}
                  alt="Scientist"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className=" w-[10rem] h-[10rem] md:w-full md:h-auto flex-shrink-0">
                <Image
                  src={image2}
                  alt="Smiling Man"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="p-6 w-full text-left md:w-2/3">
              <h2 className="text-lg font-bold md:text-xl heading">
                PLACE ORDER NOW
              </h2>
              <p className="mt-4 text-sm font-medium text-gray-700">
                IMPORTANT – PLEASE READ THESE TERMS BEFORE BOOKING
              </p>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
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

              <div className="flex justify-center mt-6 md:justify-start">
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
