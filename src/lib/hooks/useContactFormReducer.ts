import { useReducer, useCallback } from 'react';

// Types
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface SubmitStatus {
  type: 'success' | 'error' | null;
  message: string;
}

interface FormValidationErrors {
  [key: string]: string;
}

interface ContactFormState {
  formData: FormData;
  isSubmitting: boolean;
  submitStatus: SubmitStatus;
  validationErrors: FormValidationErrors;
}

// Actions
type ContactFormAction =
  | { type: 'UPDATE_FIELD'; payload: { field: keyof FormData; value: string } }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<FormData> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMIT_STATUS'; payload: SubmitStatus }
  | { type: 'SET_VALIDATION_ERRORS'; payload: FormValidationErrors }
  | { type: 'CLEAR_VALIDATION_ERRORS' }
  | { type: 'RESET_FORM' }
  | { type: 'SUBMIT_SUCCESS'; payload: string }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'START_SUBMISSION' }
  | { type: 'INITIALIZE_FORM'; payload: Partial<FormData> };

// Initial state factory
const createInitialState = (initialData: Partial<FormData> = {}): ContactFormState => ({
  formData: {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    ...initialData
  },
  isSubmitting: false,
  submitStatus: { type: null, message: '' },
  validationErrors: {}
});

// Validation function
const validateForm = (formData: FormData): FormValidationErrors => {
  const errors: FormValidationErrors = {};

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

// Reducer
function contactFormReducer(state: ContactFormState, action: ContactFormAction): ContactFormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value
        },
        // Clear validation error for this field when user starts typing
        validationErrors: {
          ...state.validationErrors,
          [action.payload.field]: ''
        }
      };

    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        }
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload
      };

    case 'SET_SUBMIT_STATUS':
      return {
        ...state,
        submitStatus: action.payload
      };

    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: action.payload
      };

    case 'CLEAR_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: {}
      };

    case 'START_SUBMISSION':
      return {
        ...state,
        isSubmitting: true,
        submitStatus: { type: null, message: '' },
        validationErrors: {}
      };

    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        submitStatus: {
          type: 'success',
          message: action.payload
        }
      };

    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        submitStatus: {
          type: 'error',
          message: action.payload
        }
      };

    case 'RESET_FORM':
      return {
        ...state,
        formData: {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        },
        submitStatus: { type: null, message: '' },
        validationErrors: {}
      };

    case 'INITIALIZE_FORM':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        }
      };

    default:
      return state;
  }
}

// Hook
export function useContactFormReducer(initialData: Partial<FormData> = {}) {
  const [state, dispatch] = useReducer(contactFormReducer, createInitialState(initialData));

  // Action creators
  const updateField = useCallback((field: keyof FormData, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
  }, []);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: updates });
  }, []);

  const clearForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const initializeForm = useCallback((data: Partial<FormData>) => {
    dispatch({ type: 'INITIALIZE_FORM', payload: data });
  }, []);

  // Validation
  const validateCurrentForm = useCallback(() => {
    const errors = validateForm(state.formData);
    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
    return Object.keys(errors).length === 0;
  }, [state.formData]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    dispatch({ type: 'START_SUBMISSION' });

    try {
      // Validate form
      const errors = validateForm(state.formData);
      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
        dispatch({ 
          type: 'SUBMIT_ERROR', 
          payload: 'Please fix the form errors and try again.' 
        });
        return false;
      }

      // Create email content
      const emailBody = `
Dear Thiasil Team,

I hope this message finds you well. I am reaching out regarding the following inquiry:

Name: ${state.formData.name}
Email: ${state.formData.email}
Phone: ${state.formData.phone || 'Not provided'}

Subject: ${state.formData.subject}

Message:
${state.formData.message}

I look forward to hearing from you.

Best regards,
${state.formData.name}`;

      // Create mailto link
      const mailtoLink = `mailto:contact@thiasil.com?subject=${encodeURIComponent(state.formData.subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;

      // Show success message
      dispatch({ 
        type: 'SUBMIT_SUCCESS', 
        payload: 'Email client opened successfully. Please send the email to complete your inquiry.' 
      });

      // Reset form after successful submission
      setTimeout(() => {
        dispatch({ type: 'RESET_FORM' });
      }, 3000);

      return true;

    } catch (error) {
      dispatch({ 
        type: 'SUBMIT_ERROR', 
        payload: 'Something went wrong. Please try again or contact us directly.' 
      });
      return false;
    }
  }, [state.formData]);

  // Advanced form utilities
  const getFieldError = useCallback((field: keyof FormData) => {
    return state.validationErrors[field] || '';
  }, [state.validationErrors]);

  const hasErrors = useCallback(() => {
    return Object.keys(state.validationErrors).length > 0;
  }, [state.validationErrors]);

  const isFormValid = useCallback(() => {
    const errors = validateForm(state.formData);
    return Object.keys(errors).length === 0;
  }, [state.formData]);

  const isFormDirty = useCallback(() => {
    return Object.values(state.formData).some(value => value.trim() !== '');
  }, [state.formData]);

  return {
    // State
    formData: state.formData,
    isSubmitting: state.isSubmitting,
    submitStatus: state.submitStatus,
    validationErrors: state.validationErrors,

    // Actions
    updateField,
    updateFormData,
    clearForm,
    initializeForm,
    handleSubmit,
    validateCurrentForm,

    // Utilities
    getFieldError,
    hasErrors,
    isFormValid,
    isFormDirty,

    // Direct dispatch for advanced usage
    dispatch
  };
}

// Type exports
export type { FormData, SubmitStatus, FormValidationErrors, ContactFormState };