"use client";
import Image from "next/image";
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

export default function Policy() {
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
        {/* Hero Glass Card */}
        <section className="flex flex-col items-center justify-center pt-32 pb-10">
          <GlassCard variant="accent" padding="large" className="w-full max-w-xl flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4 drop-shadow-[0_2px_16px_rgba(58,143,255,0.7)]">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
              Your privacy and data protection are our top priorities. This policy outlines how we collect, use, and safeguard your data.
            </p>
          </GlassCard>
        </section>

        {/* Main Content */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          {[
            {
              title: "Information We Collect",
              icon: "📊",
              variant: "primary",
              content: [
                "Personal identification information (name, email address, phone number)",
                "Contact information and communication preferences",
                "Technical data including IP address and browser information",
                "Usage data and interaction with our website"
              ]
            },
            {
              title: "How We Use Your Information",
              icon: "🎯",
              variant: "secondary",
              content: [
                "To provide and maintain our services",
                "To communicate with you about products and services",
                "To improve our website and user experience",
                "To comply with legal obligations and regulations"
              ]
            },
            {
              title: "Data Security",
              icon: "🔒",
              variant: "success",
              content: [
                "We implement industry-standard security measures",
                "Your data is encrypted during transmission",
                "Regular security audits and updates",
                "Limited access to personal information"
              ]
            },
            {
              title: "Data Sharing",
              icon: "🤝",
              variant: "warning",
              content: [
                "We do not sell your personal information",
                "Data may be shared with trusted service providers",
                "Information may be disclosed if required by law",
                "We maintain strict confidentiality agreements"
              ]
            },
            {
              title: "Your Rights",
              icon: "⚖️",
              variant: "accent",
              content: [
                "Right to access your personal data",
                "Right to correct inaccurate information",
                "Right to request deletion of your data",
                "Right to withdraw consent at any time"
              ]
            },
            {
              title: "Contact Information",
              icon: "📞",
              variant: "primary",
              content: [
                "For privacy-related questions, contact us at:",
                "Email: thiaglasswork@gmail.com",
                "Phone: +91 98205 76045",
                "Address: No. 3/16, Mahalaxmi Industrial Estate, DC Road, Lower Parel, Mumbai-400013, Maharashtra, India"
              ]
            }
          ].map((section, index) => (
            <GlassCard key={index} variant={section.variant} padding="default">
              <div className="flex items-center gap-4 mb-6">
                <GlassIcon icon={section.icon} variant={section.variant} size="large" />
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-4">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3 p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-200 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </section>

        {/* Legal Notice */}
        <section>
          <GlassCard variant="secondary" padding="large" className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-wider">
              Legal Notice
            </h3>
            <div className="space-y-6">
              <p className="text-gray-200 leading-relaxed text-lg">
                This privacy policy is effective as of January 1, 2024, and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
              </p>
              <p className="text-gray-200 leading-relaxed text-lg">
                We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* Back to Home */}
        <div className="text-center">
          <GlassButton href="/" variant="accent" size="large">
            <span>←</span>
            <span>Back to Home</span>
          </GlassButton>
        </div>
      </main>
    </div>
  );
}
