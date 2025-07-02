/**
 * Hook for monitoring application performance
 */

import { useEffect } from 'react';
import { reportWebVitals, WebVitalsMetric } from '@/lib/performance';

export function usePerformanceMonitoring() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Report Core Web Vitals if web-vitals library is available
    const reportVitals = (metric: WebVitalsMetric) => {
      reportWebVitals(metric);
    };

    // Try to import and use web-vitals if available
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(reportVitals);
      onFCP(reportVitals);
      onLCP(reportVitals);
      onTTFB(reportVitals);
      onINP(reportVitals); // INP replaced FID in v5
    }).catch(() => {
      // web-vitals not available, use basic performance API
      if ('performance' in window && 'PerformanceObserver' in window) {
        // Monitor navigation timing
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navigationEntry = entry as PerformanceNavigationTiming;
              
              // Calculate basic metrics
              const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
              const fcp = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
              
              reportVitals({
                id: 'TTFB',
                name: 'TTFB',
                value: ttfb,
                delta: ttfb,
                rating: ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor'
              });
              
              reportVitals({
                id: 'FCP',
                name: 'FCP',
                value: fcp,
                delta: fcp,
                rating: fcp <= 1800 ? 'good' : fcp <= 3000 ? 'needs-improvement' : 'poor'
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['navigation'] });
      }
    });
  }, []);
}

export default usePerformanceMonitoring;