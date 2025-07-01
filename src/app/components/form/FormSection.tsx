"use client";
import React from 'react';

export interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function FormSection({
  title,
  subtitle,
  children,
  className = '',
  collapsible = false,
  defaultCollapsed = false,
  icon,
  actions
}: FormSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className={`form-section space-y-4 ${className}`}>
      {/* Section Header */}
      <div 
        className={`flex items-center justify-between ${
          collapsible ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
        }`}
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-white/70">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-white/90 flex items-center gap-2">
              {title}
              {collapsible && (
                <span className="text-white/60 transition-transform duration-200" style={{
                  transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </span>
              )}
            </h3>
            {subtitle && (
              <p className="text-sm text-white/60 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        {actions && !collapsible && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Section Content */}
      {(!collapsible || !isCollapsed) && (
        <div className="form-section-content space-y-4">
          {children}
        </div>
      )}

      {/* Collapsed State Info */}
      {collapsible && isCollapsed && (
        <div className="text-xs text-white/50 italic">
          Click to expand section
        </div>
      )}
    </div>
  );
}