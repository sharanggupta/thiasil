export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
}

export interface FormSubmitStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export interface FormAction {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
}