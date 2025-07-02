/**
 * Performance monitoring utilities for Core Web Vitals
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Performance thresholds based on Core Web Vitals
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }  // Time to First Byte
};

/**
 * Get performance rating based on metric value and thresholds
 */
function getPerformanceRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Log performance metric (can be extended to send to analytics)
 */
export function logPerformanceMetric(metric: PerformanceMetric) {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log(`Performance: ${metric.name} = ${metric.value}ms (${metric.rating})`);
  }
  
  // Dispatch custom event for dashboard
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('performance-metric', { detail: metric }));
  }
  
  // In production, you could send to analytics service
  // Example: sendToAnalytics(metric);
}

/**
 * Report Web Vitals metrics
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  const performanceMetric: PerformanceMetric = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    timestamp: Date.now()
  };
  
  logPerformanceMetric(performanceMetric);
}

/**
 * Measure custom performance metrics
 */
export class PerformanceTimer {
  private startTime: number;
  private name: string;
  
  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }
  
  end(): PerformanceMetric {
    const endTime = performance.now();
    const value = endTime - this.startTime;
    const rating = getPerformanceRating(this.name, value);
    
    const metric: PerformanceMetric = {
      name: this.name,
      value,
      rating,
      timestamp: Date.now()
    };
    
    logPerformanceMetric(metric);
    return metric;
  }
}

/**
 * Measure API call performance
 */
export async function measureApiCall<T>(
  name: string, 
  apiCall: () => Promise<T>
): Promise<T> {
  const timer = new PerformanceTimer(`API_${name}`);
  try {
    const result = await apiCall();
    timer.end();
    return result;
  } catch (error) {
    timer.end();
    throw error;
  }
}

/**
 * Measure component render performance
 */
export function measureRender(componentName: string) {
  return new PerformanceTimer(`RENDER_${componentName}`);
}