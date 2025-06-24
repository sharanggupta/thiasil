"use client";
import Image from "next/image";
import Heading from "../components/common/Heading";
import {
    GlassButton,
    GlassCard,
    GlassIcon,
    NeonBubblesBackground
} from "../components/Glassmorphism";
import Navbar from "../components/Navbar/Navbar";
import heroImg from "../images/thiasil-1.webp";

const sidebarNav = [
  { icon: "🏠", label: "Home", href: "/" },
  { icon: "🧪", label: "Products", href: "/#products" },
  { icon: "🏢", label: "About", href: "/company" },
  { icon: "✉️", label: "Contact", href: "/contact" },
];

export default function Company() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#3a8fff] via-[#009ffd] to-[#2a2a72] overflow-x-hidden">
      <Navbar />
      <NeonBubblesBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-[#009ffd]/30 via-[#3a8fff]/20 to-[#2a2a72]/80 pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24 flex flex-col gap-20 ml-0 md:ml-32">
        {/* Breadcrumb Navigation */}
        <nav className="pt-32 pb-4">
          <div className="flex items-center space-x-2 text-base md:text-lg font-semibold text-white/90">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-white font-bold">About Us</span>
          </div>
        </nav>

        {/* Hero Glass Card */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-12 pb-10">
          <GlassCard variant="primary" padding="large" className="w-full max-w-md flex flex-col items-center relative text-center bg-white/20 text-white/95 shadow-2xl">
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-xl mx-auto">
                <Image src={heroImg} alt="Thiasil Labware" width={160} height={160} className="object-cover w-full h-full" />
              </div>
            </div>
            <Heading as="h1" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-4" size="primary">
              Excellence in Fused Silica Labware
            </Heading>
            <p className="text-lg text-white/80 mb-8 max-w-xs mx-auto">
              Setting the standard for purity, precision, and reliability in laboratory glassware for over 40 years.
            </p>
            <GlassButton href="/contact" variant="accent" size="large" className="mt-2">
              Contact Us
            </GlassButton>
          </GlassCard>
        </section>

        {/* Glassmorphism Feature Row */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-8">
          <GlassCard variant="accent" padding="default" className="w-full max-w-xs flex flex-col items-center text-center">
            <GlassIcon icon="💎" variant="accent" size="medium" className="mb-2" />
            <Heading as="h3" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-1 text-base md:text-lg" size="tertiary">
              Ultra Pure Silica
            </Heading>
            <p className="text-white/80 text-base mb-4">Made from the purest Indian raw materials for unmatched clarity and performance.</p>
          </GlassCard>
          <GlassCard variant="primary" padding="large" className="w-full max-w-sm flex flex-col items-center text-center">
            <GlassIcon icon="⚡" variant="primary" size="large" className="mb-4" />
            <Heading as="h3" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-2" size="tertiary">
              Precision Engineered
            </Heading>
            <p className="text-white/80 text-base mb-4">Every piece is crafted with advanced technology and strict quality control.</p>
          </GlassCard>
          <GlassCard variant="success" padding="large" className="w-full max-w-sm flex flex-col items-center text-center">
            <GlassIcon icon="🏆" variant="success" size="large" className="mb-4" />
            <Heading as="h3" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-2" size="tertiary">
              Award-Winning Quality
            </Heading>
            <p className="text-white/80 text-base mb-4">Recognized for reliability and value by leading labs and institutions.</p>
          </GlassCard>
          <GlassCard variant="secondary" padding="large" className="w-full max-w-sm flex flex-col items-center text-center">
            <GlassIcon icon="🔥" variant="secondary" size="large" className="mb-4" />
            <Heading as="h3" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-2" size="tertiary">
              Oxy-Gas Fired Purity
            </Heading>
            <p className="text-white/80 text-base mb-4">Each product is individually oxy-gas fired to ensure unparalleled purity and performance.</p>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}
