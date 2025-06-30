"use client";
import { GlassCard, GlassIcon, NeonBubblesBackground } from "@/app/components/Glassmorphism";
import Navbar from "@/app/components/Navbar/Navbar";
import Heading from "@/app/components/common/Heading";
import { GRADIENTS } from "@/lib/constants/gradients";

export default function AdminLayout({ children, isAuthenticated, username, handleLogout }) {
  return (
    <div className={`relative min-h-screen ${GRADIENTS.BG_PRIMARY} overflow-x-hidden`}>
      <Navbar theme={isAuthenticated ? "products" : undefined} />
      <NeonBubblesBackground />
      <div className={`absolute inset-0 ${GRADIENTS.BG_PRIMARY_OVERLAY} pointer-events-none z-0`} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24 flex flex-col gap-8 ml-0 md:ml-32">
        {isAuthenticated && (
          <section className="flex flex-col items-center justify-center pt-32 pb-10">
            <GlassCard variant="primary" padding="large" className="w-full max-w-4xl flex flex-col items-center text-center bg-white/20 text-white/95 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <GlassIcon icon="⚙️" variant="primary" size="large" />
                <Heading
                  as="h1"
                  gradient="var(--text-gradient-white)"
                  className="mb-4 drop-shadow-lg font-extrabold text-4xl md:text-5xl text-transparent bg-clip-text"
                  size="primary"
                >
                  ADMIN PANEL
                </Heading>
              </div>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Manage product prices, inventory, and backups in one unified interface
              </p>
              <div className="flex flex-col items-center gap-4 mt-4">
                <div className="text-sm text-white/60 text-center mb-2">
                  Logged in as: <span className="text-white font-medium">{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-[#3a8fff]/80 to-[#009ffd]/80 backdrop-blur-lg border border-white/30 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-blue-400/30 hover:from-[#009ffd]/80 hover:to-[#3a8fff]/80 transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  <span>Logout</span>
                  <span>←</span>
                </button>
              </div>
            </GlassCard>
          </section>
        )}
        
        {children}
      </main>
    </div>
  );
}