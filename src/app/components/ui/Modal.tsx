"use client";
import React, { useEffect, useRef } from 'react';
import { GlassButton } from "@/app/components/Glassmorphism";

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  actions?: ModalAction[];
  actionsAlignment?: 'left' | 'center' | 'right' | 'space-between';
  loading?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  preventScroll?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  actions = [],
  actionsAlignment = 'right',
  loading = false,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  preventScroll = true
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll
  useEffect(() => {
    if (!preventScroll) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventScroll]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'max-w-md';
      case 'large':
        return 'max-w-4xl';
      case 'xlarge':
        return 'max-w-6xl';
      case 'fullscreen':
        return 'max-w-none w-full h-full m-0 rounded-none';
      default:
        return 'max-w-2xl';
    }
  };

  // Get actions alignment classes
  const getActionsAlignment = () => {
    switch (actionsAlignment) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'space-between':
        return 'justify-between';
      default:
        return 'justify-end';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/50 backdrop-blur-sm
        ${overlayClassName}
      `}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`
          relative w-full ${getSizeClasses()}
          bg-gradient-to-br from-gray-900/95 to-gray-800/95
          backdrop-blur-xl border border-white/20
          rounded-xl shadow-2xl
          max-h-[90vh] overflow-hidden
          transform transition-all duration-300
          ${className}
        `}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={subtitle ? 'modal-subtitle' : undefined}
      >
        {/* Header */}
        {(title || subtitle || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-white/10">
            <div className="flex-1">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-white mb-1"
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  id="modal-subtitle"
                  className="text-white/70 text-sm"
                >
                  {subtitle}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m18 6-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m6 6 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`
          flex-1 overflow-y-auto
          ${actions.length > 0 ? 'max-h-[calc(90vh-140px)]' : 'max-h-[calc(90vh-80px)]'}
          ${contentClassName}
        `}>
          <div className="p-6">
            {children}
          </div>
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className={`
            flex gap-3 p-6 border-t border-white/10 bg-white/5
            ${getActionsAlignment()}
          `}>
            {actions.map((action, index) => (
              <GlassButton
                key={index}
                onClick={action.onClick}
                variant={action.variant || 'secondary'}
                size={action.size || 'medium'}
                disabled={action.disabled || loading}
                type={action.type || 'button'}
                className="flex items-center gap-2"
              >
                {action.loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    {action.icon && action.icon}
                    <span>{action.label}</span>
                  </>
                )}
              </GlassButton>
            ))}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-white/80 text-sm">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}