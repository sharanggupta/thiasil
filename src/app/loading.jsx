export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass-effect rounded-2xl p-8 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-4 border-white/30 border-t-blue-400 rounded-full animate-spin"></div>
        </div>
        
        <h2 className="heading-2 mb-4">Loading</h2>
        <p className="text-white/80">Please wait while we load the page...</p>
      </div>
    </div>
  );
}