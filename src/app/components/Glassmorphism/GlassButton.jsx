"use client";
import "./Glassmorphism.css";

const GlassButton = ({ 
  children, 
  className = "", 
  variant = "primary", 
  size = "medium",
  href,
  onClick,
  disabled = false,
  ...props 
}) => {
  const buttonClasses = [
    "glass-button",
    `glass-button--${variant}`,
    `glass-button--${size}`,
    disabled && "glass-button--disabled",
    className
  ].filter(Boolean).join(" ");

  const Component = href ? "a" : "button";

  return (
    <Component 
      className={buttonClasses}
      href={href}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassButton; 