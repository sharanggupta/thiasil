import { NextResponse } from 'next/server';

/**
 * Next.js 15 Enhanced Middleware
 * Performance monitoring, security headers, and request optimization
 */

export function middleware(request) {
  const response = NextResponse.next();
  
  // Performance monitoring
  const startTime = Date.now();
  
  // Add request ID for tracing
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  response.headers.set('X-Request-ID', requestId);
  
  // Security headers (enhanced in Next.js 15)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP for enhanced security
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.vercel.com https://vercel.live;"
  );
  
  // Performance hints
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-UA-Compatible', 'IE=edge');
  
  // Cache control for static assets
  const url = request.nextUrl;
  if (url.pathname.startsWith('/icons/') || url.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // API route optimizations
  if (url.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
  }
  
  // Add processing time header
  const endTime = Date.now();
  const processingTime = endTime - startTime;
  response.headers.set('X-Response-Time', `${processingTime}ms`);
  
  // Log performance metrics in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${requestId}] ${request.method} ${url.pathname} - ${processingTime}ms`);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - workbox-*.js (workbox files)
     * - manifest.json (PWA manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|workbox-.*\\.js|manifest.json).*)',
  ],
};