"use client";
import React from 'react';
import './Button.css'; // Import the CSS file for custom styles

const Button = ({
  name,
  color = '#fff', // Default text color
  bgColor = '#2d96dc', // Default background color
  padding = 'px-4 py-2', // Default padding (using utility classes or custom)
  textSize = 'text-base', // Default text size
  link = '#', // Default link
  className = '' // Additional class names if needed
}) => {
  return (
    <a
      href={link}
      className={`btn ${padding} ${textSize} ${className}`}
      style={{ color: color, backgroundColor: bgColor }} // Inline styles for color and background color
    >
      {name}
    </a>
  );
};

export default Button;
