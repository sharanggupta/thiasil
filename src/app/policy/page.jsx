import React from "react";
import logoImage from "../images/favicon.png";
import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen py-10 px-5 md:px-20">
      <div className="bg-white shadow-2xl rounded-xl p-6 md:p-12">
        <div className="flex items-center justify-between mb-10">
          <Link href={"/"}>
            <Image className="w-16 h-16" src={logoImage} alt="Logo" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 text-center flex-grow">
            Privacy Policy
          </h1>
        </div>

        <p className="text-lg text-gray-800 leading-relaxed mb-8">
          At <span className="font-semibold text-blue-600">THIASIL</span>, we are dedicated to safeguarding your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
        </p>

        {/* Information Collection Section */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Personal details like name, email, and contact information.</li>
            <li>Technical data such as browser type, IP address, and activity on our site.</li>
            <li>Feedback or inquiries submitted through our contact forms.</li>
          </ul>
        </div>

        {/* Usage Section */}
        <div className="bg-white shadow-sm p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We use the collected information to:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mt-4">
            <li>Improve our website and services.</li>
            <li>Communicate updates, promotions, or service-related notices.</li>
            <li>Ensure security and enhance your browsing experience.</li>
          </ul>
        </div>

        {/* Data Protection Section */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Protecting Your Data
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We implement advanced security measures to protect your data from unauthorized access or misuse. However, no internet transmission is entirely secure. Please share information responsibly.
          </p>
        </div>

        {/* Third-Party Services */}
        <div className="bg-white shadow-sm p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Sharing with Third Parties
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your data may be shared with trusted third-party providers for specific services, such as analytics or customer support. We ensure these parties adhere to strict confidentiality agreements.
          </p>
        </div>

        {/* Your Rights Section */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Your Rights
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Access and review your personal information.</li>
            <li>Request corrections or deletion of your data.</li>
            <li>Opt-out of promotional communications.</li>
          </ul>
        </div>

        {/* Contact and Updates */}
        <div className="bg-white shadow-sm p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions or concerns about our Privacy Policy, please
            contact us at <span className="text-blue-600 font-semibold">[thiaglasswork@gmail.com]</span>.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            We may update this policy periodically. The latest version will always be available on this page.
          </p>
        </div>
      </div>
    </div>
  );
}
