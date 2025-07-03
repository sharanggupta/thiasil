'use client';

import { useEffect, useState } from 'react';

/**
 * Performance Monitor Component using Next.js 15 features
 * Tracks client-side performance metrics and Core Web Vitals
 */

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  connectionType?: string;
  deviceMemory?: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const initializePerformanceMonitoring = () => {
      // Web Vitals tracking
      if ('web-vital' in window) {
        trackWebVitals();
      }
      
      // Connection information
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setMetrics(prev => ({
          ...prev,
          connectionType: connection.effectiveType,
        }));
      }
      
      // Device memory
      if ('deviceMemory' in navigator) {
        setMetrics(prev => ({
          ...prev,
          deviceMemory: (navigator as any).deviceMemory,
        }));
      }
      
      // Performance Observer for Core Web Vitals
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                fcp: entry.startTime,
              }));
            }
          });
        });
        
        try {
          fcpObserver.observe({ entryTypes: ['paint'] });
        } catch (error) {
          console.warn('FCP observer not supported');
        }
        
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            setMetrics(prev => ({
              ...prev,
              lcp: lastEntry.startTime,
            }));
          }
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          console.warn('LCP observer not supported');
        }
        
        // Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          setMetrics(prev => ({
            ...prev,
            cls: clsValue,
          }));
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('CLS observer not supported');
        }
      }
      
      // Navigation timing
      if ('navigation' in performance) {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          setMetrics(prev => ({
            ...prev,
            ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
          }));
        }
      }
    };
    
    const trackWebVitals = () => {
      // Track using Web Vitals library if available
      if (typeof window !== 'undefined' && 'webVitals' in window) {
        const { getFCP, getLCP, getCLS, getFID, getTTFB } = (window as any).webVitals;
        
        getFCP?.((metric: any) => {
          setMetrics(prev => ({ ...prev, fcp: metric.value }));
        });
        
        getLCP?.((metric: any) => {
          setMetrics(prev => ({ ...prev, lcp: metric.value }));
        });
        
        getCLS?.((metric: any) => {
          setMetrics(prev => ({ ...prev, cls: metric.value }));
        });
        
        getFID?.((metric: any) => {
          setMetrics(prev => ({ ...prev, fid: metric.value }));
        });
        
        getTTFB?.((metric: any) => {
          setMetrics(prev => ({ ...prev, ttfb: metric.value }));
        });
      }
    };

    // Only show in development or when explicitly enabled
    if (
      process.env.NODE_ENV === 'development' || 
      process.env.NEXT_PUBLIC_PERFORMANCE_MONITOR === 'true'
    ) {
      setIsVisible(true);
      initializePerformanceMonitoring();
    }
  }, []);
  
  const formatMetric = (value: number | undefined, suffix: string = 'ms') => {
    if (value === undefined) return 'N/A';
    return `${Math.round(value)}${suffix}`;
  };
  
  const getMetricColor = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      cls: { good: 0.1, poor: 0.25 },
      fid: { good: 100, poor: 300 },
      ttfb: { good: 800, poor: 1800 },
    };
    
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'text-gray-400';
    
    if (value <= threshold.good) return 'text-green-400';
    if (value <= threshold.poor) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm text-white text-xs p-3 rounded-lg shadow-lg max-w-xs">
      <div className="font-bold mb-2">Performance Monitor</div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-gray-300">FCP:</span>
          <span className={`ml-1 ${getMetricColor('fcp', metrics.fcp || 0)}`}>
            {formatMetric(metrics.fcp)}
          </span>
        </div>
        <div>
          <span className="text-gray-300">LCP:</span>
          <span className={`ml-1 ${getMetricColor('lcp', metrics.lcp || 0)}`}>
            {formatMetric(metrics.lcp)}
          </span>
        </div>
        <div>
          <span className="text-gray-300">CLS:</span>
          <span className={`ml-1 ${getMetricColor('cls', metrics.cls || 0)}`}>
            {formatMetric(metrics.cls, '')}
          </span>
        </div>
        <div>
          <span className="text-gray-300">FID:</span>
          <span className={`ml-1 ${getMetricColor('fid', metrics.fid || 0)}`}>
            {formatMetric(metrics.fid)}
          </span>
        </div>
        <div>
          <span className="text-gray-300">TTFB:</span>
          <span className={`ml-1 ${getMetricColor('ttfb', metrics.ttfb || 0)}`}>
            {formatMetric(metrics.ttfb)}
          </span>
        </div>
        <div>
          <span className="text-gray-300">Conn:</span>
          <span className="ml-1 text-blue-400">
            {metrics.connectionType || 'N/A'}
          </span>
        </div>
      </div>
      {metrics.deviceMemory && (
        <div className="mt-2 text-gray-300">
          Memory: {metrics.deviceMemory}GB
        </div>
      )}
    </div>
  );
}

// Hook for accessing performance metrics
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Get navigation timing
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setMetrics({
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        });
      }
    }
  }, []);
  
  return metrics;
}