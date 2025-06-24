"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ContactFormGlass from "../components/ContactForm/ContactFormGlass";
import {
    GlassButton,
    GlassCard,
    GlassIcon,
    NeonBubblesBackground
} from "../components/Glassmorphism";
import favicon from "../images/favicon.png";

const sidebarNav = [
  { icon: "🏠", label: "Home", href: "/" },
  { icon: "🧪", label: "Products", href: "/#products" },
  { icon: "🏢", label: "About", href: "/company" },
  { icon: "✉️", label: "Contact", href: "/contact" },
];

// Separate component that uses useSearchParams
function ContactFormWithParams() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || "";
  const initialEmail = searchParams.get("email") || "";
  const initialPhone = searchParams.get("phone") || "";
  
  return (
    <ContactFormGlass initialName={initialName} initialEmail={initialEmail} initialPhone={initialPhone} />
  );
}

export default function Contact() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#2e026d] via-[#15162c] to-[#0a0a23] overflow-x-hidden">
      <NeonBubblesBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a8fff]/30 via-[#a259ff]/20 to-[#0a0a23]/80 pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <aside className="fixed top-6 left-6 z-30 flex flex-col items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 w-20 h-[80vh] min-h-[400px] max-h-[90vh] justify-between">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-lg mb-2 overflow-hidden">
            <Image src={favicon} alt="Thiasil Logo" width={40} height={40} className="object-contain w-8 h-8" />
          </div>
        </div>
        <nav className="flex flex-col gap-6 items-center mt-4">
          {sidebarNav.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center group"
              title={item.label}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-md group-hover:bg-gradient-to-br group-hover:from-[#3a8fff]/60 group-hover:to-[#a259ff]/60 transition-all">
                <span className="text-2xl text-white drop-shadow-lg">{item.icon}</span>
              </div>
              <span className="text-xs text-white/60 mt-1 group-hover:text-white transition-all">{item.label}</span>
            </a>
          ))}
        </nav>
        <div />
      </aside>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24 flex flex-col gap-20 ml-0 md:ml-32">
        {/* Breadcrumb Navigation */}
        <nav className="pt-32 pb-4">
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-white font-medium">
              Contact
            </span>
          </div>
        </nav>

        {/* Hero Glass Card */}
        <section className="flex flex-col items-center justify-center pb-10">
          <GlassCard variant="primary" padding="large" className="w-full max-w-xl flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4 drop-shadow-[0_2px_16px_rgba(58,143,255,0.7)]">
              Contact Us
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
              Get in touch with our team for inquiries, quotes, and support. We'll get back to you within 24 hours.
            </p>
          </GlassCard>
        </section>

        {/* Main Content */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form Section */}
          <GlassCard variant="primary" padding="large">
            <GlassIcon icon="✉️" variant="primary" size="large" className="mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2 text-center uppercase tracking-wider">
              Send us a Message
            </h2>
            <Suspense fallback={<div className="text-white text-center py-8">Loading form...</div>}>
              <ContactFormWithParams />
            </Suspense>
          </GlassCard>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <GlassCard variant="accent" padding="large">
              <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-wider">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <GlassIcon icon="📞" variant="accent" size="medium" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                    <p className="text-gray-200 text-base">+91 98205 76045</p>
                    <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <GlassIcon icon="📧" variant="accent" size="medium" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-200 text-base">thiaglasswork@gmail.com</p>
                    <p className="text-gray-400 text-sm">24/7 support available</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <GlassIcon icon="📍" variant="accent" size="medium" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Address</h3>
                    <p className="text-gray-200 text-base">No. 3/16, Mahalaxmi Industrial Estate, DC Road, Lower Parel, Mumbai-400013, Maharashtra, India</p>
                    <p className="text-gray-400 text-sm">Main manufacturing facility</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Business Hours */}
            <GlassCard variant="success" padding="default">
              <h3 className="text-xl font-bold text-white mb-6 text-center uppercase tracking-wider">
                Business Hours
              </h3>
              <div className="space-y-4">
                {[
                  { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
                  { day: "Saturday", time: "9:00 AM - 2:00 PM" },
                  { day: "Sunday", time: "Closed" }
                ].map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                    <span className="text-white font-medium">{schedule.day}</span>
                    <span className="text-gray-200">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Quick Links */}
            <GlassCard variant="warning" padding="default">
              <h3 className="text-xl font-bold text-white mb-6 text-center uppercase tracking-wider">
                Quick Links
              </h3>
              <div className="space-y-4">
                <GlassButton href="/company" variant="warning" size="medium" className="w-full justify-between">
                  <span>About Us</span>
                  <span>→</span>
                </GlassButton>
                <GlassButton href="/policy" variant="warning" size="medium" className="w-full justify-between">
                  <span>Privacy Policy</span>
                  <span>→</span>
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>
    </div>
  );
}
