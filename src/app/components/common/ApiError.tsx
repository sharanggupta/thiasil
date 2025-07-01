export default function ApiError({ 
  error, 
  onRetry, 
  title = 'Failed to Load Data',
  showDetails = false 
}) {
  if (!error) return null;

  return (
    <div className="p-6 rounded-xl glass-effect text-center max-w-md mx-auto">
      <div className="text-3xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <p className="text-white/80 mb-4">
        {error.message || 'An unexpected error occurred while loading data.'}
      </p>
      
      {showDetails && error.status && (
        <details className="text-left mb-4 text-sm">
          <summary className="cursor-pointer text-white/60 mb-2">Technical Details</summary>
          <div className="bg-black/30 p-3 rounded-lg text-white/90">
            <p>Status: {error.status} - {error.statusText}</p>
            <p>Endpoint: {error.endpoint}</p>
            <p>Method: {error.method}</p>
          </div>
        </details>
      )}
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="btn-base btn-glass"
        >
          Try Again
        </button>
      )}
    </div>
  );
}