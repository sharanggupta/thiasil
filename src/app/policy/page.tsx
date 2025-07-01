"use client";
import {
    GlassButton,
    GlassCard,
    GlassIcon,
    NeonBubblesBackground
} from "../components/Glassmorphism";
import Navbar from "@/app/components/Navbar/Navbar";
import Heading from "@/app/components/common/Heading";
import Breadcrumb from "@/app/components/common/Breadcrumb";
import { GRADIENTS } from "@/lib/constants/gradients";


export default function Policy() {
  return (
    <div className={`relative min-h-screen ${GRADIENTS.BG_PRIMARY} overflow-x-hidden`}>
      <Navbar />
      <NeonBubblesBackground />
      <div className={`absolute inset-0 ${GRADIENTS.BG_PRIMARY_OVERLAY} pointer-events-none z-0`} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24 flex flex-col gap-20 ml-0 md:ml-32">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { href: "/", label: "Home" },
            { label: "Privacy Policy" }
          ]}
          className="text-base md:text-lg font-semibold text-white/90"
        />

        {/* Hero Glass Card */}
        <section className="flex flex-col items-center justify-center pt-32 pb-10">
          <GlassCard variant="accent" padding="large" className="w-full max-w-xl flex flex-col items-center text-center">
            <Heading as="h1" gradient="var(--text-gradient-primary)" className="mb-4" size="primary">
              Privacy Policy
            </Heading>
            <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
              Your privacy and data protection are our top priorities. This policy outlines how we collect, use, and safeguard your data.
            </p>
          </GlassCard>
        </section>
        {/* Main Policy Content in GlassCard */}
        <section className="flex flex-col items-center justify-center">
          <GlassCard variant="primary" padding="large" className="w-full max-w-4xl flex flex-col gap-8 text-white/90">
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
                    <Heading as="h3" gradient="var(--text-gradient-primary)" className="tracking-wider" size="secondary">
                      {section.title}
                    </Heading>
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
          </GlassCard>
        </section>
      </main>
    </div>
  );
}
