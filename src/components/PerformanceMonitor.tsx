'use client';

import { usePerformanceMonitoring } from '@/lib/hooks/usePerformanceMonitoring';

/**
 * Performance monitoring component that tracks Core Web Vitals
 * This component is invisible and only handles performance tracking
 */
export default function PerformanceMonitor() {
  usePerformanceMonitoring();
  
  // This component renders nothing but handles performance monitoring
  return null;
}