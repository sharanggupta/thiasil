"use client";
import React from "react";
import { FormActions as BaseFormActions } from "@/app/components/form";
import { FormAction } from "./types";

interface FormActionsProps {
  clearForm: () => void;
  submitForm: () => void;
  isSubmitting: boolean;
}

export default function FormActions({ 
  clearForm, 
  submitForm, 
  isSubmitting 
}: FormActionsProps) {
  const formActions: FormAction[] = [
    {
      label: 'Clear Form',
      onClick: clearForm,
      variant: 'secondary',
      disabled: isSubmitting,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      label: 'Send Message',
      onClick: submitForm,
      variant: 'primary',
      loading: isSubmitting,
      disabled: isSubmitting,
      type: 'submit',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m22 2-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <BaseFormActions 
      actions={formActions}
      alignment="space-between"
    />
  );
}