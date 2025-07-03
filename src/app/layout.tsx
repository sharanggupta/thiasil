import { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { CouponProvider } from "@/contexts/CouponContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import PWAInstallPrompt from "@/app/components/pwa/PWAInstallPrompt";
import OfflineStatus from "@/app/components/pwa/OfflineStatus";
import ServiceWorkerRegistration from "@/app/components/pwa/ServiceWorkerRegistration";
import PWADevIndicator from "@/app/components/pwa/PWADevIndicator";
import { OrganizationStructuredData, WebSiteStructuredData } from "@/app/components/seo/StructuredData";

// Importing the Lato Google Font
const lato = Lato({
  weight: ["100", "300", "400", "700"], // Specify weights you need
  subsets: ["latin"], // Load the required subset, e.g., latin
  variable: "--font-lato", // CSS variable to reference the font
});

export const metadata: Metadata = {
  title: {
    default: "Thiasil | Premium Laboratory Glassware & Silica Crucibles",
    template: "%s | Thiasil - Quality Laboratory Glassware"
  },
  keywords: [
    "Thiasil", "laboratory glassware", "silica crucibles", "oxy-gas fired", 
    "quartz crucibles", "laboratory equipment", "scientific glassware", 
    "premium quality", "India manufacturer", "analytical chemistry"
  ],
  description: "Thiasil manufactures premium individually oxy-gas fired laboratory glassware and silica crucibles. Quality rivaling international standards with competitive pricing. Trusted by laboratories worldwide.",
  authors: [{ name: "Thiasil", url: "https://thiasil.com" }],
  creator: "Thiasil",
  publisher: "Thiasil",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thiasil.com",
    siteName: "Thiasil",
    title: "Thiasil | Premium Laboratory Glassware & Silica Crucibles",
    description: "Premium individually oxy-gas fired laboratory glassware and silica crucibles. Quality rivaling international standards.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Thiasil Laboratory Glassware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiasil | Premium Laboratory Glassware & Silica Crucibles",
    description: "Premium individually oxy-gas fired laboratory glassware and silica crucibles. Quality rivaling international standards.",
    images: ["/images/og-image.jpg"],
    creator: "@thiasil",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Thiasil",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  category: "laboratory equipment",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A6EBD",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
      {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17303074947"></script>
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17303074947');
            `
          }} />
        <OrganizationStructuredData />
        <WebSiteStructuredData />
      </head>
      <body className={`${lato.variable} antialiased`}>
        <CouponProvider enablePersistence={true} maxHistorySize={10}>
          <PerformanceMonitor />
          <ServiceWorkerRegistration />
          <OfflineStatus />
          {children}
          <PWAInstallPrompt />
          <PWADevIndicator />
        </CouponProvider>
      </body>
    </html>
  );
}