"use client";
import "./Glassmorphism.css";

const GlassStat = ({ 
  icon,
  label, 
  value,
  className = "", 
  variant = "default", 
  ...props 
}) => {
  const statClasses = [
    "glass-stat",
    `glass-stat--${variant}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={statClasses} {...props}>
      {icon && <div className="glass-stat__icon">{icon}</div>}
      <div className="glass-stat__content">
        <div className="glass-stat__value">{value}</div>
        <div className="glass-stat__label">{label}</div>
      </div>
    </div>
  );
};

export default GlassStat; 