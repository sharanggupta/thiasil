import React from "react";
import Image from "next/image";
import Link from "next/link";
import logoImage from "../images/favicon.png";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-5 md:px-20">
      <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-14 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/">
            <Image
              className="w-16 md:w-20 transform transition-transform hover:scale-110"
              src={logoImage}
              alt="Logo"
            />
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 text-center flex-grow">
            Contact Us
          </h1>
        </div>

        <p className="text-gray-600 text-lg md:text-xl text-center mb-10 leading-relaxed">
          We're here to help. Whether you have questions or need assistance, you
          can reach us through the following contact details or by filling out
          the form below.
        </p>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-2">
              Phone Number
            </h2>
            <p className="text-gray-700 text-lg">
              <a
                href="tel:+919820576045"
                className="hover:text-blue-500 transition duration-300"
              >
                +91 98205 76045
              </a>
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-2">
              Email
            </h2>
            <p className="text-gray-700 text-lg">
              <a
                href="mailto:thiaglasswork@gmail.com"
                className="hover:text-blue-500 transition duration-300"
              >
                thiaglasswork@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          action="https://formspree.io/f/{your_form_id}" // Replace {your_form_id} with your actual Formspree form ID
          method="POST"
          className="space-y-8"
        >
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>

            {/* Contact Number Field */}
            <div>
              <label
                htmlFor="contact"
                className="block text-gray-700 font-medium mb-2"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                required
                placeholder="Your Contact Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-2xl hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
