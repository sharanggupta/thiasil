// PWA utility functions

export interface PWACapabilities {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  supportsNotifications: boolean;
  supportsPush: boolean;
  supportsBackgroundSync: boolean;
}

export function getPWACapabilities(): PWACapabilities {
  if (typeof window === 'undefined') {
    return {
      canInstall: false,
      isInstalled: false,
      isStandalone: false,
      supportsNotifications: false,
      supportsPush: false,
      supportsBackgroundSync: false,
    };
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone ||
                      document.referrer.includes('android-app://');

  return {
    canInstall: 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window,
    isInstalled: isStandalone,
    isStandalone,
    supportsNotifications: 'Notification' in window,
    supportsPush: 'PushManager' in window,
    supportsBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
  };
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'default') {
    return await Notification.requestPermission();
  }

  return Notification.permission;
}

export function showNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options,
    });
  }
  return null;
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

export function shareContent(data: ShareData): Promise<void> | void {
  if ('navigator' in window && 'share' in navigator) {
    return navigator.share(data);
  } else {
    // Fallback: copy to clipboard or use social sharing
    fallbackShare(data);
  }
}

function fallbackShare(data: ShareData) {
  const url = data.url || window.location.href;
  const text = data.text || '';
  const title = data.title || document.title;
  
  // Try to copy to clipboard
  if (navigator.clipboard) {
    const shareText = `${title}\n${text}\n${url}`;
    navigator.clipboard.writeText(shareText).then(() => {
      showNotification('Copied to clipboard', {
        body: 'Share content has been copied to your clipboard',
      });
    });
  }
}

export function trackPWAUsage(action: string, label?: string) {
  // Track PWA-specific events
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', action, {
      event_category: 'PWA',
      event_label: label,
    });
  }
}

export async function cacheImportantResources(): Promise<void> {
  if (!('caches' in window)) {
    return;
  }

  const cache = await caches.open('thiasil-critical-v1');
  const resourcesToCache = [
    '/',
    '/products',
    '/contact',
    '/company',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
  ];

  try {
    await cache.addAll(resourcesToCache);
  } catch (error) {
    console.error('Failed to cache critical resources:', error);
  }
}

export function getInstallPromptText(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome') && userAgent.includes('mobile')) {
    return 'Add Thiasil to your home screen for quick access. Tap the menu button and select "Add to Home screen".';
  } else if (userAgent.includes('safari') && userAgent.includes('mobile')) {
    return 'Add Thiasil to your home screen. Tap the share button and select "Add to Home Screen".';
  } else if (userAgent.includes('firefox')) {
    return 'Install Thiasil as an app. Click the menu button and select "Install".';
  } else {
    return 'Install Thiasil as an app for the best experience.';
  }
}

export function isRunningAsPWA(): boolean {
  return getPWACapabilities().isStandalone;
}

export async function updateServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return true;
    }
  } catch (error) {
    console.error('Failed to update service worker:', error);
  }
  
  return false;
}

// PWA Performance tracking
export function trackPWAPerformance() {
  if (typeof window === 'undefined') return;

  // Track app load time for PWA
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    const isPWA = isRunningAsPWA();
    
    trackPWAUsage('app_load_time', isPWA ? 'pwa' : 'browser');
    
    if ('gtag' in window) {
      (window as any).gtag('event', 'timing_complete', {
        name: 'app_load',
        value: Math.round(loadTime),
        event_category: isPWA ? 'PWA' : 'Web',
      });
    }
  });
}