"use client";
import React from 'react';
import { NeonBubblesBackground } from "@/app/components/Glassmorphism";

export default function CategoryLoadingState() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--dark-primary-gradient)' }}>
      <NeonBubblesBackground />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Loading...</h1>
          <p className="text-gray-300 mb-8">Please wait while we load the category data.</p>
          
          {/* Loading animation */}
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}