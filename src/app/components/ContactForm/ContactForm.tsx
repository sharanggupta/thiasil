"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../MainButton/Button";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to /contact with query params
    const params = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    }).toString();
    router.push(`/contact?${params}`);
  };

  return (
    <div className="contact-form-container h-160 " id="order-now">
      {/* Background image container */}
      <div className="contact-form-bg-image">
        {/* The actual form */}
        <div className="contact-form">
          <h2 className="heading">GET IN TOUCH WITH US</h2>
          <form className="form" onSubmit={handleSubmit} aria-label="Contact Form">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full name"
                className="input-field focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]"
                value={formData.name}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                className="input-field focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="input-field focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]"
                value={formData.phone}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
            <Button
              name="Next Step "
              color="#ffff"
              bgColor="#2196f3"
              textSize="text-sm md:text-base"
              padding="px-3 md:px-5 py-2 md:py-3"
              className="mt-5 w-1/2 md:w-1/3 text-center focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]"
              type="submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
