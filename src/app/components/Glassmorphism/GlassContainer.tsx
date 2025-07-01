"use client";
import React from 'react';

const GlassContainer = ({
  children,
  className = "",
  variant = "default", // default, subtle, nested
  padding = "medium", // small, medium, large
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "subtle":
        return "bg-white/3 rounded-xl border border-white/5";
      case "nested":
        return "bg-white/5 rounded-lg border border-white/10";
      default:
        return "bg-white/5 rounded-xl border border-white/10";
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case "small":
        return "p-3";
      case "large":
        return "p-8";
      case "medium":
      default:
        return "p-6";
    }
  };

  const baseClasses = `${getVariantClasses()} ${getPaddingClasses()}`;
  
  return (
    <div
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassContainer;