import ErrorBoundary from './ErrorBoundary';

export default function LayoutErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      title="Layout Error"
      message="There was a problem loading the page layout. This might be a temporary issue."
      fallback={(error, retry) => (
        <div className="min-h-screen flex items-center justify-center p-8 bg-linear-to-br from-blue-900 via-purple-900 to-pink-900">
          <div className="glass-effect rounded-2xl p-8 max-w-lg text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Thiasil</h1>
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-4">Page Layout Error</h2>
            <p className="text-white/80 mb-6">
              We&apos;re experiencing technical difficulties. Please try again.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={retry}
                className="btn-base btn-glass"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-base bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}