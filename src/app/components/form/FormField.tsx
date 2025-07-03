"use client";
import React from 'react';
import { GlassInput } from "@/app/components/Glassmorphism";

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'textarea' | 'select';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  options?: Array<{ value: string | number; label: string }>;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  maxLength,
  min,
  max,
  step,
  rows = 3,
  options = [],
  className = '',
  size = 'medium'
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = type === 'number' ? (e.target.value ? Number(e.target.value) : '') : e.target.value;
    onChange(newValue);
  };

  const fieldId = `field-${name}`;
  const hasError = Boolean(error);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1 text-sm';
      case 'large':
        return 'px-5 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const renderInput = () => {
    const baseClasses = `w-full ${getSizeClasses()} bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-hidden transition-colors ${
      hasError 
        ? 'border-red-400 focus:border-red-300' 
        : 'border-white/20 focus:border-[#3a8fff]'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    if (type === 'textarea') {
      return (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          className={`${baseClasses} resize-vertical`}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className={baseClasses}
        >
          {!required && <option value="">Select an option</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <GlassInput
        id={fieldId}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        className={hasError ? 'border-red-400 focus:border-red-300' : ''}
      />
    );
  };

  return (
    <div className={`form-field ${className}`}>
      {/* Label */}
      <label 
        htmlFor={fieldId}
        className={`block text-sm font-medium mb-2 ${
          hasError ? 'text-red-300' : 'text-white/80'
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Input */}
      {renderInput()}

      {/* Error Message */}
      {hasError && (
        <div className="mt-1 flex items-center gap-1 text-red-300 text-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="m15 9-6 6" stroke="currentColor" strokeWidth="2"/>
            <path d="m9 9 6 6" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Help Text */}
      {helpText && !hasError && (
        <div className="mt-1 text-xs text-white/60">
          {helpText}
        </div>
      )}
    </div>
  );
}