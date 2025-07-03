"use client";
import { useState, useEffect } from "react";
import { ContactFormData, ContactFormProps, FormSubmitStatus } from "./types";

export function useContactForm({ 
  initialName = "", 
  initialEmail = "", 
  initialPhone = "" 
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<FormSubmitStatus>({ 
    type: null, 
    message: '' 
  });

  // Update state if props change (e.g., on navigation)
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: initialName,
      email: initialEmail,
      phone: initialPhone
    }));
  }, [initialName, initialEmail, initialPhone]);

  const updateField = (field: keyof ContactFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): Record<string, string> => {
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

  const submitForm = async () => {
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
        clearForm();
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

  return {
    formData,
    isSubmitting,
    submitStatus,
    updateField,
    clearForm,
    submitForm
  };
}