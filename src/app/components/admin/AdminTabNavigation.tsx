"use client";
import React from 'react';
import { GlassCard, GlassButton } from "@/app/components/Glassmorphism";

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

interface AdminTabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function AdminTabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange 
}: AdminTabNavigationProps) {
  return (
    <section className="w-full">
      <GlassCard variant="secondary" padding="medium" className="w-full">
        <div className="flex gap-1 md:gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent px-1 md:px-0 justify-center md:justify-start">
          {tabs.map((tab) => (
            <GlassButton
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={activeTab === tab.id ? "primary" : "secondary"}
              size="medium"
              className={`flex items-center gap-2 uppercase font-bold tracking-wide px-3 py-2 md:px-5 md:py-2 rounded-2xl transition-all duration-200 min-w-[120px] ${
                activeTab === tab.id ? "shadow-lg shadow-blue-400/30" : ""
              }`}
            >
              <span className="flex items-center text-lg md:text-xl">{tab.icon}</span>
              <span className="text-sm md:text-base">{tab.label}</span>
            </GlassButton>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}