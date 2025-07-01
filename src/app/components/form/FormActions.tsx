"use client";
import React from 'react';
import { GlassButton } from "@/app/components/Glassmorphism";

export interface FormAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export interface FormActionsProps {
  actions: FormAction[];
  alignment?: 'left' | 'center' | 'right' | 'space-between';
  direction?: 'row' | 'column';
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function FormActions({
  actions,
  alignment = 'center',
  direction = 'row',
  gap = 'medium',
  className = ''
}: FormActionsProps) {
  const getContainerClasses = () => {
    const directionClasses = {
      row: 'flex-row',
      column: 'flex-col'
    };

    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      'space-between': 'justify-between'
    };

    const gapClasses = {
      small: 'gap-2',
      medium: 'gap-4',
      large: 'gap-6'
    };

    return `flex ${directionClasses[direction]} ${alignmentClasses[alignment]} ${gapClasses[gap]}`;
  };

  return (
    <div className={`form-actions ${getContainerClasses()} ${className}`}>
      {actions.map((action, index) => (
        <GlassButton
          key={index}
          onClick={action.onClick}
          variant={action.variant || 'primary'}
          size={action.size || 'medium'}
          disabled={action.disabled || action.loading}
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
  );
}