'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { GlassButton } from '@/app/components/Glassmorphism';

/**
 * Modern Form Component using Next.js 15 features
 * Utilizes enhanced form handling and progressive enhancement
 */

interface ModernFormProps {
  action: (prevState: any, formData: FormData) => Promise<any>;
  children: React.ReactNode;
  className?: string;
  onSubmit?: (formData: FormData) => void;
}

export default function ModernForm({ 
  action, 
  children, 
  className = '',
  onSubmit 
}: ModernFormProps) {
  const [state, formAction] = useActionState(action, null);
  
  const handleSubmit = (formData: FormData) => {
    onSubmit?.(formData);
    formAction(formData);
  };
  
  return (
    <form action={handleSubmit} className={`modern-form ${className}`}>
      {children}
      {state?.error && (
        <div className="error-message text-red-500 text-sm mt-2">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="success-message text-green-500 text-sm mt-2">
          {state.success}
        </div>
      )}
      <FormSubmitButton />
    </form>
  );
}

function FormSubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <GlassButton
      type="submit"
      variant="accent"
      disabled={pending}
      className="w-full mt-4"
    >
      {pending ? 'Submitting...' : 'Submit'}
    </GlassButton>
  );
}

// Hook for form state management
export function useFormState() {
  const { pending } = useFormStatus();
  
  return {
    isPending: pending,
    isSubmitting: pending,
  };
}

// Enhanced form validation hook
export function useFormValidation(schema: any) {
  const validateForm = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    
    try {
      schema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error: any) {
      return {
        isValid: false,
        errors: error.errors?.reduce((acc: any, err: any) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {}) || {},
      };
    }
  };
  
  return { validateForm };
}