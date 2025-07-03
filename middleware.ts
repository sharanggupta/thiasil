import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 15 Enhanced Middleware
 * Consolidated security, performance monitoring, and request optimization
 * Combines features from both previous middleware implementations
 */

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Performance monitoring
  const startTime = Date.now();
  
  // Add request ID for tracing and debugging
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  response.headers.set('X-Request-ID', requestId);
  
  // Core security headers (enhanced for Next.js 15)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Enhanced Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.vercel.com https://vercel.live https://www.google-analytics.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // Performance optimization headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-UA-Compatible', 'IE=edge');
  
  // Handle different route types
  const url = request.nextUrl;
  const pathname = url.pathname;
  
  // Static asset caching
  if (pathname.startsWith('/icons/') || 
      pathname.startsWith('/_next/static/') || 
      pathname.startsWith('/images/') ||
      pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // API route security and caching
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // Additional API security headers
    response.headers.set('X-Robots-Tag', 'noindex');
  }
  
  // Admin panel specific security
  if (pathname.startsWith('/admin')) {
    // Force HTTPS in production
    if (process.env.NODE_ENV === 'production' && 
        request.headers.get('x-forwarded-proto') !== 'https') {
      const httpsUrl = request.nextUrl.clone();
      httpsUrl.protocol = 'https:';
      return NextResponse.redirect(httpsUrl);
    }
    
    // Enhanced security for admin routes
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    
    // Stricter CSP for admin panel
    const adminCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'"
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', adminCSP);
  }
  
  // Rate limiting headers (informational)
  if (pathname.startsWith('/api/admin/') || pathname.startsWith('/api/upload-image')) {
    response.headers.set('X-RateLimit-Policy', '10;w=300'); // 10 requests per 5 minutes
  }
  
  // Add processing time header for performance monitoring
  const endTime = Date.now();
  const processingTime = endTime - startTime;
  response.headers.set('X-Response-Time', `${processingTime}ms`);
  
  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${requestId}] ${request.method} ${pathname} - ${processingTime}ms`);
  }
  
  // Security monitoring: Log suspicious requests
  if (pathname.includes('..') || 
      pathname.includes('<script') || 
      pathname.includes('javascript:') ||
      pathname.includes('eval(')) {
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    console.warn(`[SECURITY] Suspicious request detected: ${pathname} from ${clientIP}`);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - workbox-*.js (workbox files)
     * - manifest.json (PWA manifest)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sw.js|workbox-.*\\.js|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};