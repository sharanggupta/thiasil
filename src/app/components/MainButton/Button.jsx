"use client";
import { useRouter } from "next/navigation";
import "./Button.css";

const Button = ({
  name,
  color = "#fff",
  bgColor = "#2d96dc",
  padding = "px-4 py-2",
  textSize = "text-base", // Default text size
  className = "",
  onClick, // Add onClick as a prop
  href, // Add href as a prop
  ...props
}) => {
  const router = useRouter();
  const buttonStyle = { color: color, backgroundColor: bgColor };
  const buttonClasses = `btn ${padding} ${textSize} ${className}`;

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
