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
    <div className="contact-form-container h-[40rem] " id="order-now">
      {/* Background image container */}
      <div className="contact-form-bg-image">
        {/* The actual form */}
        <div className="contact-form">
          <h2 className="heading">GET IN TOUCH WITH US</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="input-field"
              value={formData.phone}
              onChange={handleChange}
            />
            <Button
              name="Next Step "
              color="#ffff"
              bgColor="#2196f3"
              textSize="text-sm md:text-base"
              padding="px-3 md:px-5 py-2 md:py-3"
              className="mt-5 w-1/2 md:w-1/3 text-center"
              type="submit"
            />
            <p className="contact-info">TEL : +919820576045</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
