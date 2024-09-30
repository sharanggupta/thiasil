import React from "react";
import "./ContactForm.css";
import Button from "../MainButton/Button";

const ContactForm = () => {
  return (
    <div className="contact-form-container h-[40rem] ">
      {/* Background image container */}
      <div className="contact-form-bg-image">
        {/* The actual form */}
        <div className="contact-form">
          <h2 className="heading">GET IN TOUCH WITH US</h2>
          <form className="form">
            <input
              type="text"
              placeholder="Full name"
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email address"
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="input-field"
            />
            <Button
              name="Next Step "
              color="#ffff"
              bgColor="#2196f3"
              textSize="text-sm md:text-base"
              padding="px-3 md:px-5 py-2 md:py-3"
              link="#"
              className="mt-5 w-1/2 md:w-1/3 text-center"
            />
            <p className="contact-info">TEL : +919820576045</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
