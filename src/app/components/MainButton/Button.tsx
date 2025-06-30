"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import "./Button.css";

interface ButtonProps {
  name: any;
  color?: string;
  bgColor?: string;
  padding: any;
  textSize: any;
  className?: string;
  onClick?: any;
  href?: any;
  size?: string;
  [key: string]: any;
}

const Button = ({
  name,
  color = "#fff",
  bgColor = "#2d96dc",
  padding,
  textSize,
  className = "",
  onClick,
  href,
  size = "medium", // new prop
  ...props
}: ButtonProps) => {
  const router = useRouter();
  // Set default padding/textSize based on size prop if not provided
  let defaultPadding = "px-7 py-3";
  let defaultTextSize = "text-base";
  if (size === "small") {
    defaultPadding = "px-4 py-2";
    defaultTextSize = "text-sm";
  } else if (size === "large") {
    defaultPadding = "px-10 py-5";
    defaultTextSize = "text-lg";
  }
  const buttonStyle = { color: color, backgroundColor: bgColor };
  const buttonClasses = `btn ${padding || defaultPadding} ${textSize || defaultTextSize} ${className}`;

  const handleClick = (e) => {
    if (href) {
      e.preventDefault();
      if (href.startsWith('#')) {
        // Handle anchor links
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Handle navigation
        router.push(href);
      }
    }
    if (onClick) {
      onClick(e);
    }
  };

  // If href is provided, render as button with navigation
  if (href) {
    return (
      <button
        className={buttonClasses}
        style={buttonStyle}
        onClick={handleClick}
        type="button"
        {...props}
      >
        {name}
      </button>
    );
  }

  // Otherwise render as regular button
  return (
    <button
      className={buttonClasses}
      style={buttonStyle}
      onClick={onClick}
      type="button"
      {...props}
    >
      {name}
    </button>
  );
};

export default Button;
