"use client";
/**
 * Smoothly scrolls to a section if a hash is present in the URL.
 * Used to enable smooth anchor navigation from any page.
 */
import { useEffect } from "react";

const SCROLL_DELAY_MS = 100;

export default function SmoothScrollToSection() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const sectionId = window.location.hash.replace('#', '');
      // Always scroll to top first to undo browser jump
      window.scrollTo(0, 0);
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, SCROLL_DELAY_MS);
    }
  }, []);
  return null;
} 