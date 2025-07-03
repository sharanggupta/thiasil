"use client";
import React from 'react';

interface GlassInputProps {
  type?: string;
  value: any;
  onChange: any;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  [key: string]: any;
}

const GlassInput = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  disabled = false,
  required = false,
  maxLength,
  min,
  max,
  step,
  ...props
}: GlassInputProps) => {
  const baseClasses = "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-hidden focus:border-[#3a8fff] transition-colors";
  
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      {...props}
    />
  );
};

export default GlassInput;