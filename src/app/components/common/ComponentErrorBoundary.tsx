import ErrorBoundary from './ErrorBoundary';

export default function ComponentErrorBoundary({ 
  children, 
  componentName = 'Component',
  fallbackMessage 
}) {
  return (
    <ErrorBoundary
      title={`${componentName} Error`}
      message={fallbackMessage || `The ${componentName} component failed to load.`}
      fallback={(error, retry) => (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="text-2xl mb-3">🔧</div>
          <h3 className="text-lg font-medium text-white mb-2">Component Error</h3>
          <p className="text-white/70 text-sm mb-4">
            {fallbackMessage || `The ${componentName} component encountered an error.`}
          </p>
          <button 
            onClick={retry} 
            className="btn-base btn-glass text-xs px-4 py-2"
          >
            Retry Component
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}