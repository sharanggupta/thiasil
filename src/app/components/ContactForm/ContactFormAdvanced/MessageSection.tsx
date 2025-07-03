"use client";
import React from "react";
import { FormSection, FormField } from "@/app/components/form";
import { ContactFormData } from "./types";

interface MessageSectionProps {
  formData: ContactFormData;
  updateField: (field: keyof ContactFormData, value: string | number) => void;
  isSubmitting: boolean;
}

export default function MessageSection({ 
  formData, 
  updateField, 
  isSubmitting 
}: MessageSectionProps) {
  return (
    <FormSection 
      title="Your Message" 
      subtitle="Tell us how we can help you"
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      }
    >
      <FormField
        label="Subject"
        name="subject"
        type="text"
        value={formData.subject}
        onChange={(value) => updateField('subject', value)}
        placeholder="What is this regarding?"
        required
        disabled={isSubmitting}
        maxLength={100}
      />

      <FormField
        label="Message"
        name="message"
        type="textarea"
        value={formData.message}
        onChange={(value) => updateField('message', value)}
        placeholder="Please describe your inquiry in detail..."
        required
        disabled={isSubmitting}
        rows={5}
        maxLength={1000}
      />
    </FormSection>
  );
}