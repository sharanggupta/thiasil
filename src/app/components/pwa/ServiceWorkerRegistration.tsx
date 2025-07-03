"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register service worker in production or when explicitly enabled
    const shouldRegister = 'serviceWorker' in navigator && 
      (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_PWA_DEV === 'true');
    
    if (shouldRegister) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      // New update available
                      showUpdateAvailableNotification();
                    }
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  const showUpdateAvailableNotification = () => {
    // Show a notification that an update is available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Thiasil App Update', {
        body: 'A new version of the app is available. Refresh to update.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'app-update'
      });
    }
  };

  return null; // This component doesn't render anything
}

// Hook for service worker management
export function useServiceWorker() {
  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }
  };

  const skipWaiting = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }
  };

  return { checkForUpdates, skipWaiting };
}