import React from "react";

export default function ContactUs() {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5 md:px-20">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 flex flex-col" >
        {/* Header */}
        <h1 className="text-4xl font-bold heading text-blue-600 text-center mb-8">
          Contact Us
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Have questions? Feel free to reach out to us using the contact
          information below or the form provided. We're here to help!
        </p>

        {/* Contact Information */}
        <div className="flex flex-col md:flex-row items-center md:justify-between mb-10">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <h2 className="text-2xl  font-semibold text-blue-600 mb-2">
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

          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-semibold  text-blue-600 mb-2">Email</h2>
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
          className="space-y-6"
        >
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
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
