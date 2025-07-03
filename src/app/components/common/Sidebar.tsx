"use client";
import Image from "next/image";
import { NAVIGATION } from "../../../lib/constants";

const Sidebar = ({ className = "" }) => {
  return (
    <aside role="navigation" aria-label="Sidebar Navigation" className={`hidden sm:flex fixed top-6 left-6 z-30 flex-col items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 w-20 h-[80vh] min-h-[400px] max-h-[90vh] justify-between ${className}`}>
      {/* Logo */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-lg mb-2 overflow-hidden">
          <Image 
            src="/favicon.ico" 
            alt="Thiasil Logo" 
            width={40} 
            height={40} 
            className="object-contain w-8 h-8" 
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-6 items-center mt-4">
        {NAVIGATION.SIDEBAR_NAV.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center group"
            title={item.label}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-md group-hover:bg-linear-to-br group-hover:from-[#3a8fff]/60 group-hover:to-[#a259ff]/60 transition-all">
              <span className="text-2xl text-white drop-shadow-lg">{item.icon}</span>
            </div>
            <span className="text-xs text-white/60 mt-1 group-hover:text-white transition-all">
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Spacer */}
      <div />
    </aside>
  );
};

export default Sidebar; 