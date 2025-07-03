"use client";
import React from "react";
import { FormSection, FormField, FieldGroup } from "@/app/components/form";
import { ContactFormData } from "./types";

interface ContactInfoSectionProps {
  formData: ContactFormData;
  updateField: (field: keyof ContactFormData, value: string | number) => void;
  isSubmitting: boolean;
}

export default function ContactInfoSection({ 
  formData, 
  updateField, 
  isSubmitting 
}: ContactInfoSectionProps) {
  return (
    <FormSection 
      title="Contact Information" 
      subtitle="How can we reach you?"
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      }
    >
      <FieldGroup columns={2}>
        <FormField
          label="Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={(value) => updateField('name', value)}
          placeholder="Enter your full name"
          required
          disabled={isSubmitting}
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          placeholder="your.email@example.com"
          required
          disabled={isSubmitting}
        />
      </FieldGroup>

      <FormField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(value) => updateField('phone', value)}
        placeholder="+1 (555) 123-4567"
        disabled={isSubmitting}
        helpText="Optional - for urgent inquiries"
      />
    </FormSection>
  );
}