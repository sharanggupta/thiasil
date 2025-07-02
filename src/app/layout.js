import { Lato } from "next/font/google";
import "./globals.css";
import { CouponProvider } from "@/contexts/CouponContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";

// Importing the Lato Google Font
const lato = Lato({
  weight: ["100", "300", "400", "700"], // Specify weights you need
  subsets: ["latin"], // Load the required subset, e.g., latin
  variable: "--font-lato", // CSS variable to reference the font
});

export const metadata = {
  title: "Thiasil | Quality Silica",
  keywords: ["Thiasil", "Individually OXY-GAS fired", "Silica", "Quartz", "crucibles", "glass", "cheap", "india"],
  description: "Individually OXY-GAS fired laboratory glass with quality rivalling international standards and cheapest price made in India"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lato.variable} antialiased`}>
        <CouponProvider enablePersistence={true} maxHistorySize={10}>
          <PerformanceMonitor />
          {children}
        </CouponProvider>
      </body>
    </html>
  );
}
