"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ContactFormGlass from "@/app/components/ContactForm/ContactFormGlass";
import { GlassButton, GlassCard, GlassIcon, NeonBubblesBackground } from "@/app/components/Glassmorphism";
import Navbar from "@/app/components/Navbar/Navbar";
import Breadcrumb from "@/app/components/common/Breadcrumb";
import Heading from "@/app/components/common/Heading";


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
    <div className="min-h-screen w-full flex flex-col items-center pt-32 relative overflow-x-hidden" style={{ background: 'var(--dark-primary-gradient)' }}>
      <Navbar theme="products" />
      <NeonBubblesBackground />
      <div className="min-h-screen w-full flex flex-col items-center pt-32 relative overflow-x-hidden" style={{ background: 'var(--dark-primary-gradient)' }}>
        <main className="relative z-10 w-full max-w-3xl mx-auto px-4 pb-24 flex flex-col gap-12">
          {/* Breadcrumb Navigation */}
          <Breadcrumb 
            items={[
              { href: "/", label: "Home" },
              { label: "Contact" }
            ]}
            className="text-sm text-white/80"
          />
          {/* Glassmorphic Card Panel */}
          <GlassCard variant="primary" padding="large" className="w-full flex flex-col md:flex-row gap-10 items-center text-white shadow-2xl" style={{ background: 'var(--primary-gradient)' }}>
            {/* Left: Contact Form */}
            <div className="flex-1 min-w-[260px]">
              <Heading as="h1" gradient="var(--text-gradient-white)" className="mb-6 text-left" size="primary">Contact Us</Heading>
              <p className="text-base md:text-lg text-white/90 mb-8 max-w-md">Get in touch with our team for inquiries, quotes, and support. We'll get back to you within 24 hours.</p>
              <Suspense fallback={<div className="text-white text-center py-8">Loading form...</div>}>
                <ContactFormWithParams />
              </Suspense>
            </div>
            {/* Right: Contact Info */}
            <div className="flex-1 min-w-[260px] space-y-7">
              <div className="flex items-start gap-4">
                <GlassIcon icon="📞" variant="accent" size="medium" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                  <p className="text-white text-base">+91 98205 76045</p>
                  <p className="text-blue-200 text-sm">Mon-Fri, 9AM-6PM IST</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <GlassIcon icon="📧" variant="accent" size="medium" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                  <p className="text-white text-base">thiaglasswork@gmail.com</p>
                  <p className="text-blue-200 text-sm">24/7 support available</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="glass-icon glass-icon--accent glass-icon--medium">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="glass-icon__emoji">
                    <ellipse cx="16" cy="12" rx="7" ry="7" fill="#3a8fff" fillOpacity="0.8"/>
                    <ellipse cx="16" cy="12" rx="3" ry="3" fill="#fff"/>
                    <path d="M16 29c5-7 9-11.5 9-17A9 9 0 1 0 7 12c0 5.5 4 10 9 17z" stroke="#3a8fff" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Address</h3>
                  <p className="text-white text-base">No. 3/16, Mahalaxmi Industrial Estate, DC Road, Lower Parel, Mumbai-400013, Maharashtra, India</p>
                  <p className="text-blue-200 text-sm">Main manufacturing facility</p>
                </div>
              </div>
              {/* Business Hours */}
              <div className="mt-8">
                <Heading as="h3" gradient="var(--text-gradient-white)" className="mb-3" size="tertiary">Business Hours</Heading>
                <div className="space-y-2">
                  {[
                    { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
                    { day: "Saturday", time: "9:00 AM - 2:00 PM" },
                    { day: "Sunday", time: "Closed" }
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">{schedule.day}</span>
                      <span className="text-blue-100">{schedule.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Quick Links */}
              <div className="mt-8">
                <Heading as="h3" gradient="var(--text-gradient-white)" className="mb-3" size="tertiary">Quick Links</Heading>
                <div className="space-y-2">
                  <GlassButton href="/company" variant="warning" size="medium" className="w-full justify-between text-white">
                    <span>About Us</span>
                    <span>→</span>
                  </GlassButton>
                  <GlassButton href="/policy" variant="warning" size="medium" className="w-full justify-between text-white">
                    <span>Privacy Policy</span>
                    <span>→</span>
                  </GlassButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
