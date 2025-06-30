"use client";
import React from 'react';
import Link from 'next/link';
import { GlassButton, NeonBubblesBackground } from "@/app/components/Glassmorphism";
import Heading from "@/app/components/common/Heading";

interface CategoryNotFoundProps {
  error?: string;
}

export default function CategoryNotFound({ error }: CategoryNotFoundProps) {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--dark-primary-gradient)' }}>
      <NeonBubblesBackground />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          <Heading as="h1" gradient="var(--text-gradient-primary)" className="mb-4" size="primary">
            {error === 'Category not found' ? 'Category Not Found' : 'Something Went Wrong'}
          </Heading>
          <p className="text-gray-300 mb-8">
            {error === 'Category not found' 
              ? 'The requested category could not be found.' 
              : error || 'An error occurred while loading the category.'}
          </p>
          <Link href="/products">
            <GlassButton variant="primary">Back to Products</GlassButton>
          </Link>
        </div>
      </div>
    </div>
  );
}