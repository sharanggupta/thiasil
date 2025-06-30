"use client";
import "./Glassmorphism.css";

const GlassIcon = ({ 
  icon, 
  className = "", 
  variant = "default", 
  size = "medium",
  ...props 
}) => {
  const iconClasses = [
    "glass-icon",
    `glass-icon--${variant}`,
    `glass-icon--${size}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={iconClasses} {...props}>
      <span className="glass-icon__emoji">{icon}</span>
    </div>
  );
};

export default GlassIcon; 