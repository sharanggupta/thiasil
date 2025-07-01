"use client";
import "./Glassmorphism.css";

const GlassCard = ({ 
  children, 
  className = "", 
  variant = "default", 
  hover = true,
  padding = "default",
  ...props 
}) => {
  const cardClasses = [
    "glass-card",
    `glass-card--${variant}`,
    hover && "glass-card--hover",
    `glass-card--padding-${padding}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default GlassCard; 