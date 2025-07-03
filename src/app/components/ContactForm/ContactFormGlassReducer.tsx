"use client";
import React, { useEffect } from "react";
import { FormContainer, FormSection, FormField, FieldGroup, FormActions } from "@/app/components/form";
import { useContactFormReducer } from "@/lib/hooks/useContactFormReducer";

interface ContactFormGlassV2ReducerProps {
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
}

export default function ContactFormGlassV2Reducer({ 
  initialName = "", 
  initialEmail = "", 
  initialPhone = "" 
}: ContactFormGlassV2ReducerProps) {
  const {
    formData,
    isSubmitting,
    submitStatus,
    updateField,
    clearForm,
    handleSubmit,
    initializeForm,
    isFormDirty
  } = useContactFormReducer();

  // Update state if props change (e.g., on navigation)
  useEffect(() => {
    initializeForm({
      name: initialName,
      email: initialEmail,
      phone: initialPhone
    });
  }, [initialName, initialEmail, initialPhone, initializeForm]);

  const formActions = [
    {
      label: 'Clear Form',
      onClick: clearForm,
      variant: 'secondary' as const,
      disabled: isSubmitting || !isFormDirty(),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      label: 'Send Message',
      onClick: handleSubmit,
      variant: 'primary' as const,
      loading: isSubmitting,
      disabled: isSubmitting,
      type: 'submit' as const,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m22 2-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <FormContainer
      title="Get in Touch"
      subtitle="Send us a message and we'll get back to you as soon as possible"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      loading={isSubmitting}
      error={submitStatus.type === 'error' ? submitStatus.message : undefined}
      success={submitStatus.type === 'success' ? submitStatus.message : undefined}
    >
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
            onChange={(value) => updateField('name', value as string)}
            placeholder="Enter your full name"
            required
            disabled={isSubmitting}
          />

          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => updateField('email', value as string)}
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
          onChange={(value) => updateField('phone', value as string)}
          placeholder="+1 (555) 123-4567"
          disabled={isSubmitting}
          helpText="Optional - for urgent inquiries"
        />
      </FormSection>

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
          onChange={(value) => updateField('subject', value as string)}
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
          onChange={(value) => updateField('message', value as string)}
          placeholder="Please describe your inquiry in detail..."
          required
          disabled={isSubmitting}
          rows={5}
          maxLength={1000}
        />
      </FormSection>

      <FormActions 
        actions={formActions}
        alignment="space-between"
      />
    </FormContainer>
  );
}