"use client";
import React from 'react';
import Modal, { ModalProps, ModalAction } from './Modal';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  submitVariant?: 'primary' | 'secondary' | 'accent' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showCancelButton?: boolean;
  additionalActions?: ModalAction[];
  className?: string;
}

export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitVariant = 'primary',
  loading = false,
  disabled = false,
  size = 'medium',
  showCancelButton = true,
  additionalActions = [],
  className = ''
}: FormModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading && !disabled) {
      onSubmit(e);
    }
  };

  const actions: ModalAction[] = [
    ...additionalActions,
    ...(showCancelButton ? [{
      label: cancelLabel,
      onClick: onClose,
      variant: 'secondary' as const,
      disabled: loading
    }] : []),
    {
      label: submitLabel,
      onClick: () => {
        // Submit the form by triggering the form's submit event
        const form = document.querySelector(`#form-modal-${title.replace(/\s+/g, '-').toLowerCase()}`) as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      },
      variant: submitVariant,
      loading: loading,
      disabled: disabled || loading,
      type: 'submit' as const,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
          <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size={size}
      actions={actions}
      actionsAlignment="space-between"
      loading={loading}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
      showCloseButton={!loading}
      className={className}
    >
      <form
        id={`form-modal-${title.replace(/\s+/g, '-').toLowerCase()}`}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <fieldset disabled={loading} className="space-y-6">
          {children}
        </fieldset>
      </form>
    </Modal>
  );
}