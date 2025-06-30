"use client";
import React from 'react';
import Modal, { ModalProps, ModalAction } from './Modal';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'secondary' | 'accent' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  loading = false,
  icon,
  type = 'info'
}: ConfirmationModalProps) {
  const getDefaultTitle = () => {
    switch (type) {
      case 'warning':
        return 'Warning';
      case 'danger':
        return 'Confirm Deletion';
      case 'success':
        return 'Success';
      default:
        return 'Confirm Action';
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'danger':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-400">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="m15 9-6 6" stroke="currentColor" strokeWidth="2"/>
            <path d="m9 9 6 6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'success':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-400">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v-4" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8h.01" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
    }
  };

  const actions: ModalAction[] = [
    {
      label: cancelLabel,
      onClick: onClose,
      variant: 'secondary',
      disabled: loading
    },
    {
      label: confirmLabel,
      onClick: onConfirm,
      variant: confirmVariant,
      loading: loading,
      disabled: loading
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || getDefaultTitle()}
      size="small"
      actions={actions}
      actionsAlignment="space-between"
      loading={loading}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
      showCloseButton={!loading}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {icon || getDefaultIcon()}
        </div>
        <div className="flex-1">
          <p className="text-white/90 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}