"use client";
import Image from "next/image";
import {
  GlassButton,
  GlassCard,
  GlassIcon,
  NeonBubblesBackground
} from "../components/Glassmorphism";
import favicon from "../images/favicon.png";
import heroImg from "../images/thiasil-1.webp";

const sidebarNav = [
  { icon: "🏠", label: "Home", href: "/" },
  { icon: "🧪", label: "Products", href: "/#products" },
  { icon: "🏢", label: "About", href: "/company" },
  { icon: "✉️", label: "Contact", href: "/contact" },
];

export default function Company() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#2e026d] via-[#15162c] to-[#0a0a23] overflow-x-hidden">
      <NeonBubblesBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a8fff]/30 via-[#a259ff]/20 to-[#0a0a23]/80 pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <aside className="fixed top-6 left-6 z-30 flex flex-col items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 w-20 h-[80vh] min-h-[400px] max-h-[90vh] justify-between">
        {/* Thiasil Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-lg mb-2 overflow-hidden">
            <Image src={favicon} alt="Thiasil Logo" width={40} height={40} className="object-contain w-8 h-8" />
          </div>
        </div>
        {/* Nav Icons */}
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
        {/* Spacer */}
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
              About Us
            </span>
          </div>
        </nav>

        {/* Hero Glass Card */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-12 pb-10">
          <GlassCard variant="primary" padding="large" className="w-full max-w-md flex flex-col items-center relative text-center">
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-xl mx-auto">
                <Image src={heroImg} alt="Thiasil Labware" width={160} height={160} className="object-cover w-full h-full" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4 drop-shadow-[0_2px_16px_rgba(58,143,255,0.7)]">
              Excellence in Fused Silica Labware
            </h1>
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
          <GlassCard variant="accent" padding="large" className="w-full max-w-sm flex flex-col items-center text-center">
            <GlassIcon icon="💎" variant="accent" size="large" className="mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Ultra Pure Silica</h3>
            <p className="text-white/80 text-base mb-4">Made from the purest Indian raw materials for unmatched clarity and performance.</p>
          </GlassCard>
          <GlassCard variant="primary" padding="large" className="w-full max-w-sm flex flex-col items-center text-center">
            <GlassIcon icon="⚡" variant="primary" size="large" className="mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Precision Engineered</h3>
            <p className="text-white/80 text-base mb-4">Every piece is crafted with advanced technology and strict quality control.</p>
          </GlassCard>
          <GlassCard variant="success" padding="large" className="w-full max-w-sm flex flex-col items-center text-center">
            <GlassIcon icon="🏆" variant="success" size="large" className="mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Award-Winning Quality</h3>
            <p className="text-white/80 text-base mb-4">Recognized for reliability and value by leading labs and institutions.</p>
          </GlassCard>
          <GlassCard variant="secondary" padding="large" className="w-full max-w-sm flex flex-col items-center text-center">
            <GlassIcon icon="🔥" variant="secondary" size="large" className="mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Oxy-Gas Fired Purity</h3>
            <p className="text-white/80 text-base mb-4">Each product is individually oxy-gas fired to ensure unparalleled purity and performance.</p>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}
