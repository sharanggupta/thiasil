"use client";

const GlassBadge = ({ 
  children, 
  variant = "default", 
  size = "medium", 
  className = "", 
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "info":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "accent":
        return "bg-[#3a8fff]/20 text-[#3a8fff] border-[#3a8fff]/30";
      default:
        return "bg-white/10 text-white/80 border-white/20";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "px-2 py-0.5 text-xs";
      case "large":
        return "px-4 py-2 text-sm";
      default:
        return "px-3 py-1 text-xs";
    }
  };

  const baseClasses = "inline-flex items-center justify-center rounded-full font-medium border transition-colors";
  
  return (
    <span 
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default GlassBadge;