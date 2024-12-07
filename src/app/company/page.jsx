import React from "react";
import logoImage from "../images/favicon.png";
import Image from "next/image";
import Link from "next/link";
export default function Company() {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5 md:px-20">
      {/* Logo in the top-left */}

      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          {/* Company Overview Section */}
          <div className="">
            <Link href= {"/"}>
              <Image className="w-20" src={logoImage} alt="Logo" />
            </Link>
          </div>

          <h1 className="text-center text-4xl heading  flex-grow">
            About THIASIL
          </h1>
        </div>

        <p className="text-gray-700 leading-relaxed text-justify mb-6">
          THIASIL fused silica laboratory wares are made from pure selected
          Indian raw material by a unique process developed in India. Since its
          inception, THIASIL has constantly endeavored to achieve optimum levels
          of capability and quality at par with international standards. This is
          attributed to strong research development and timely upgradation of
          technology, benefiting the customer in quality, cost, purity, and
          performance.
        </p>
        <p className="text-gray-700 leading-relaxed text-justify mb-6">
          THIASIL products are widely used in research institutions, quality
          control laboratories, and industrial testing labs across India. Each
          product is individually oxy-gas fired and 100% tested to ensure
          unparalleled purity and performance.
        </p>

        {/* Highlights Section */}
        <div className="mt-8">
          <h2 className="text-3xl heading font-semibold  mb-4">
            Key Highlights
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Ideal import substitute</li>
            <li>Saves 50% in cost</li>
            <li>100% Indian technology and materials</li>
            <li>Made with precision</li>
            <li>Maintains highest quality standards</li>
            <li>Most reliable and economical</li>
            <li>All products are 100% tested</li>
            <li>Combustion tubes and heater tubes</li>
            <li>Infra-red transmission tubes for electro heat application</li>
          </ul>
        </div>

        {/* Factsheet Section */}
        <div className="mt-10">
          <h2 className="text-3xl heading font-semibold  mb-4">Factsheet</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-left text-sm md:text-base">
              <thead>
                <tr className="bg-blue-100 text-black uppercase">
                  <th className="py-3 px-4 border-b border-gray-300">Field</th>
                  <th className="py-3 px-4 border-b border-gray-300">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border-b">Nature of Business</td>
                  <td className="py-3 px-4 border-b">Manufacturer</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">Company CEO</td>
                  <td className="py-3 px-4 border-b">Deepak Gupta</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">
                    Total Number of Employees
                  </td>
                  <td className="py-3 px-4 border-b">Up to 10 People</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">Year of Establishment</td>
                  <td className="py-3 px-4 border-b">1983</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">Legal Status of Firm</td>
                  <td className="py-3 px-4 border-b">
                    Individual - Proprietor
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
