"use client";
import React from "react";
import { FormContainer } from "@/app/components/form";
import { useContactForm } from "./useContactForm";
import ContactInfoSection from "./ContactInfoSection";
import MessageSection from "./MessageSection";
import FormActions from "./FormActions";
import { ContactFormProps } from "./types";

export default function ContactFormV2(props: ContactFormProps) {
  const {
    formData,
    isSubmitting,
    submitStatus,
    updateField,
    clearForm,
    submitForm
  } = useContactForm(props);

  return (
    <FormContainer
      title="Get in Touch"
      subtitle="Send us a message and we'll get back to you as soon as possible"
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
      loading={isSubmitting}
      error={submitStatus.type === 'error' ? submitStatus.message : undefined}
      success={submitStatus.type === 'success' ? submitStatus.message : undefined}
    >
      <ContactInfoSection 
        formData={formData}
        updateField={updateField}
        isSubmitting={isSubmitting}
      />

      <MessageSection 
        formData={formData}
        updateField={updateField}
        isSubmitting={isSubmitting}
      />

      <FormActions 
        clearForm={clearForm}
        submitForm={submitForm}
        isSubmitting={isSubmitting}
      />
    </FormContainer>
  );
}