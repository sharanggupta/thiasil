"use client";
import React from "react";
import "./Button.css";

const Button = ({
  name,
  color = "#fff",
  bgColor = "#2d96dc",
  padding = "px-4 py-2",
  textSize = "text-base", // Default text size
  className = "",
  onClick, // Add onClick as a prop
}) => {
  return (
    <a
      className={`btn ${padding} ${textSize} ${className}`}
      style={{ color: color, backgroundColor: bgColor }}
      onClick={onClick} 
      role="button" 
    >
      {name}
    </a>
  );
};

export default Button;
