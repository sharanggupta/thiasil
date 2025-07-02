'use client';

import { useState, useEffect } from 'react';
import { GlassCard, GlassContainer } from '@/app/components/Glassmorphism';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface MetricDisplayProps {
  metric: PerformanceMetric;
  thresholds: { good: number; poor: number };
}

function MetricCard({ metric, thresholds }: MetricDisplayProps) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-400';
      case 'needs-improvement': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '📊';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium">{metric.name}</h3>
        <span className="text-xl">{getRatingIcon(metric.rating)}</span>
      </div>
      
      <div className={`text-2xl font-bold ${getRatingColor(metric.rating)} mb-1`}>
        {formatValue(metric.name, metric.value)}
      </div>
      
      <div className="text-xs text-white/50">
        Good: ≤{metric.name === 'CLS' ? thresholds.good : `${thresholds.good}ms`} | 
        Poor: &gt;{metric.name === 'CLS' ? thresholds.poor : `${thresholds.poor}ms`}
      </div>
      
      <div className="text-xs text-white/40 mt-2">
        {new Date(metric.timestamp).toLocaleTimeString()}
      </div>
    </GlassCard>
  );
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  const THRESHOLDS = {
    LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
    FID: { good: 100, poor: 300 },   // First Input Delay
    CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
    FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
    TTFB: { good: 800, poor: 1800 },  // Time to First Byte
    INP: { good: 200, poor: 500 }    // Interaction to Next Paint
  };

  useEffect(() => {
    // Check if performance monitoring is supported
    setIsSupported(typeof window !== 'undefined' && 'performance' in window);

    // Load stored metrics from localStorage
    const stored = localStorage.getItem('thiasil-performance-metrics');
    if (stored) {
      try {
        setMetrics(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored metrics:', error);
      }
    }

    // Listen for new performance metrics
    const handlePerformanceMetric = (event: CustomEvent<PerformanceMetric>) => {
      const newMetric = event.detail;
      setMetrics(prev => {
        const updated = [...prev.filter(m => m.name !== newMetric.name), newMetric];
        localStorage.setItem('thiasil-performance-metrics', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('performance-metric' as any, handlePerformanceMetric);
    
    return () => {
      window.removeEventListener('performance-metric' as any, handlePerformanceMetric);
    };
  }, []);

  const clearMetrics = () => {
    setMetrics([]);
    localStorage.removeItem('thiasil-performance-metrics');
  };

  const refreshMetrics = () => {
    // Trigger a page reload to collect fresh metrics
    window.location.reload();
  };

  if (!isSupported) {
    return (
      <GlassContainer className="p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Performance Dashboard</h2>
        <p className="text-white/60">Performance monitoring is not supported in this environment.</p>
      </GlassContainer>
    );
  }

  return (
    <GlassContainer className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Performance Dashboard</h2>
        <div className="flex gap-2">
          <button 
            onClick={refreshMetrics}
            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
          >
            🔄 Refresh
          </button>
          <button 
            onClick={clearMetrics}
            className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {metrics.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-white font-medium mb-2">No Performance Data Yet</h3>
          <p className="text-white/60 mb-4">
            Navigate through the site to collect Core Web Vitals metrics.
          </p>
          <p className="text-white/40 text-sm">
            Metrics are automatically collected when you interact with pages.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {metrics.map((metric) => (
              <MetricCard 
                key={metric.name} 
                metric={metric} 
                thresholds={THRESHOLDS[metric.name as keyof typeof THRESHOLDS] || { good: 1000, poor: 3000 }}
              />
            ))}
          </div>

          <GlassCard className="p-4">
            <h3 className="text-white font-medium mb-3">About Core Web Vitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/80 font-medium">LCP - Largest Contentful Paint</div>
                <div className="text-white/60">Time to render the largest content element</div>
              </div>
              <div>
                <div className="text-white/80 font-medium">FCP - First Contentful Paint</div>
                <div className="text-white/60">Time to first content render</div>
              </div>
              <div>
                <div className="text-white/80 font-medium">CLS - Cumulative Layout Shift</div>
                <div className="text-white/60">Visual stability during loading</div>
              </div>
              <div>
                <div className="text-white/80 font-medium">TTFB - Time to First Byte</div>
                <div className="text-white/60">Server response time</div>
              </div>
              <div>
                <div className="text-white/80 font-medium">INP - Interaction to Next Paint</div>
                <div className="text-white/60">Responsiveness to user interactions</div>
              </div>
            </div>
          </GlassCard>
        </>
      )}
    </GlassContainer>
  );
}