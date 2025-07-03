"use client";

import { useState } from 'react';
import { shareContent, showNotification } from '@/lib/pwa-utils';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ShareButton({
  title = 'Thiasil - Quality Laboratory Glassware',
  text = 'Check out Thiasil for premium laboratory glassware and scientific equipment.',
  url,
  className = '',
  children
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    
    try {
      const shareData = {
        title,
        text,
        url: url || window.location.href,
      };

      await shareContent(shareData);
    } catch (error) {
      // Fallback: copy to clipboard
      const shareText = `${title}\n${text}\n${url || window.location.href}`;
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        showNotification('Copied to clipboard', {
          body: 'Share link has been copied to your clipboard',
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`inline-flex items-center gap-2 transition-opacity ${
        isSharing ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
      } ${className}`}
      aria-label="Share this page"
    >
      {children || (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z"
              fill="currentColor"
            />
          </svg>
          Share
        </>
      )}
    </button>
  );
}