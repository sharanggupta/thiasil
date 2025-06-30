'use client';

import { Component } from 'react';
import { logError } from '@/lib/error';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
      props: this.props,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="glass-effect rounded-2xl p-8 max-w-md text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-4">
              {this.props.title || 'Something went wrong'}
            </h2>
            <p className="text-white/80 mb-6">
              {this.props.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mb-6 text-sm">
                <summary className="cursor-pointer text-white/60 mb-2">Error Details (Development)</summary>
                <pre className="bg-black/30 p-4 rounded-lg overflow-auto max-h-40 text-white/90 text-xs">
                  {this.state.error && this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="btn-base btn-glass"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-base bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;