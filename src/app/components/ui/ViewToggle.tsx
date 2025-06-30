"use client";
import React from 'react';
import { GlassButton } from "@/app/components/Glassmorphism";

export type ViewMode = 'grid' | 'list' | 'compact';

export interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  availableViews?: ViewMode[];
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function ViewToggle({
  currentView,
  onViewChange,
  availableViews = ['grid', 'list'],
  className = '',
  size = 'medium'
}: ViewToggleProps) {
  const getViewIcon = (view: ViewMode) => {
    switch (view) {
      case 'grid':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'list':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'compact':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getViewLabel = (view: ViewMode) => {
    switch (view) {
      case 'grid':
        return 'Grid View';
      case 'list':
        return 'List View';
      case 'compact':
        return 'Compact View';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1 ${className}`}>
      {availableViews.map((view) => (
        <GlassButton
          key={view}
          onClick={() => onViewChange(view)}
          variant={currentView === view ? 'primary' : 'secondary'}
          size={size}
          className={`
            flex items-center gap-2 transition-all
            ${currentView === view ? 'bg-white/10' : 'hover:bg-white/5'}
          `}
          aria-label={getViewLabel(view)}
          title={getViewLabel(view)}
        >
          {getViewIcon(view)}
          <span className="hidden sm:inline">{getViewLabel(view)}</span>
        </GlassButton>
      ))}
    </div>
  );
}