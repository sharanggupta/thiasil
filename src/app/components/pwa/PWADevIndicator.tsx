"use client";

import { useState, useEffect } from 'react';

export default function PWADevIndicator() {
  const [showIndicator, setShowIndicator] = useState(false);
  const [pwaStatus, setPWAStatus] = useState<'disabled' | 'enabled' | 'installed'>('disabled');

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    setShowIndicator(true);

    // Check PWA status
    const checkPWAStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone;
      
      if (isStandalone) {
        setPWAStatus('installed');
      } else if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            setPWAStatus('enabled');
          } else {
            setPWAStatus('disabled');
          }
        });
      } else {
        setPWAStatus('disabled');
      }
    };

    checkPWAStatus();
  }, []);

  const getStatusColor = () => {
    switch (pwaStatus) {
      case 'installed': return 'bg-green-500';
      case 'enabled': return 'bg-blue-500';
      case 'disabled': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (pwaStatus) {
      case 'installed': return 'PWA Installed';
      case 'enabled': return 'PWA Active';
      case 'disabled': return 'PWA Disabled (Dev)';
      default: return 'PWA Unknown';
    }
  };

  if (!showIndicator) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${getStatusColor()} text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-2`}>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        {getStatusText()}
      </div>
    </div>
  );
}