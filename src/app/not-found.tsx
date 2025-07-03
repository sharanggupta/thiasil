import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass-effect rounded-2xl p-8 max-w-lg text-center">
        <div className="text-4xl mb-6">🔍</div>
        
        <h1 className="heading-1 mb-4">
          Page Not Found
        </h1>
        
        <div className="text-6xl font-black text-gradient-primary mb-6">404</div>
        
        <p className="body-large text-white/80 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
          <h3 className="text-white font-semibold mb-3">What can you do?</h3>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-center">
              <span className="text-blue-400 mr-3">→</span>
              Check the URL for typing errors
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-3">→</span>
              Go back to the previous page
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-3">→</span>
              Visit our homepage
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-3">→</span>
              Browse our products
            </li>
          </ul>
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn-base btn-glass">
            Go Home
          </Link>
          
          <Link href="/products" className="btn-base bg-white/10 hover:bg-white/20 text-white border border-white/20">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}