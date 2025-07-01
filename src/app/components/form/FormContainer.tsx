"use client";
import React from 'react';
import { GlassContainer } from "@/app/components/Glassmorphism";

export interface FormContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  loading?: boolean;
  error?: string;
  success?: string;
}

export default function FormContainer({
  title,
  subtitle,
  children,
  onSubmit,
  className = '',
  loading = false,
  error,
  success
}: FormContainerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !loading) {
      onSubmit(e);
    }
  };

  return (
    <GlassContainer className={`form-container ${className}`}>
      {/* Form Header */}
      {(title || subtitle) && (
        <div className="form-header mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-white/70">{subtitle}</p>
          )}
        </div>
      )}

      {/* Global Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="m15 9-6 6" stroke="currentColor" strokeWidth="2"/>
              <path d="m9 9 6 6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="font-medium">Error</span>
          </div>
          <p className="text-red-300/80 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Global Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="font-medium">Success</span>
          </div>
          <p className="text-green-300/80 text-sm mt-1">{success}</p>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={loading} className="space-y-6">
          {children}
        </fieldset>
      </form>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-white/80 text-sm">Processing...</p>
          </div>
        </div>
      )}
    </GlassContainer>
  );
}