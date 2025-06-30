"use client";
import React, { useState, useEffect } from "react";
import { FormContainer, FormSection, FormField, FieldGroup, FormActions } from "@/app/components/form";

interface ContactFormGlassV2Props {
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
}

export default function ContactFormGlassV2({ 
  initialName = "", 
  initialEmail = "", 
  initialPhone = "" 
}: ContactFormGlassV2Props) {
  const [formData, setFormData] = useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Update state if props change (e.g., on navigation)
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: initialName,
      email: initialEmail,
      phone: initialPhone
    }));
  }, [initialName, initialEmail, initialPhone]);

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    return errors;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Validate form
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setSubmitStatus({
          type: 'error',
          message: 'Please fix the form errors and try again.'
        });
        return;
      }

      // Create email content
      const emailBody = `
Dear Thiasil Team,

I hope this message finds you well. I am reaching out regarding the following inquiry:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

Subject: ${formData.subject}

Message:
${formData.message}

I look forward to hearing from you.

Best regards,
${formData.name}`;

      // Create mailto link
      const mailtoLink = `mailto:contact@thiasil.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;

      // Show success message
      setSubmitStatus({
        type: 'success',
        message: 'Email client opened successfully. Please send the email to complete your inquiry.'
      });

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setSubmitStatus({ type: null, message: '' });
      }, 3000);

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setSubmitStatus({ type: null, message: '' });
  };

  const formActions = [
    {
      label: 'Clear Form',
      onClick: clearForm,
      variant: 'secondary' as const,
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

      <FormActions 
        actions={formActions}
        alignment="space-between"
      />
    </FormContainer>
  );
}