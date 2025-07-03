import { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { CouponProvider } from "@/contexts/CouponContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import PWAInstallPrompt from "@/app/components/pwa/PWAInstallPrompt";
import OfflineStatus from "@/app/components/pwa/OfflineStatus";
import ServiceWorkerRegistration from "@/app/components/pwa/ServiceWorkerRegistration";
import PWADevIndicator from "@/app/components/pwa/PWADevIndicator";

// Importing the Lato Google Font
const lato = Lato({
  weight: ["100", "300", "400", "700"], // Specify weights you need
  subsets: ["latin"], // Load the required subset, e.g., latin
  variable: "--font-lato", // CSS variable to reference the font
});

export const metadata: Metadata = {
  title: "Thiasil | Quality Silica",
  keywords: ["Thiasil", "Individually OXY-GAS fired", "Silica", "Quartz", "crucibles", "glass", "cheap", "india"],
  description: "Individually OXY-GAS fired laboratory glass with quality rivalling international standards and cheapest price made in India",
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