import Link from "next/link";
import { NAVIGATION } from "@/lib/constants";

const footerLinkClassName = "hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]";

export default function FooterNavigation({ onTermsClick }) {
  return (
    <div className="flex flex-wrap justify-center items-center pt-4 mb-6 space-x-4 text-sm text-center uppercase border-t-2 text-nowrap md:mb-0">
      {NAVIGATION.FOOTER_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={footerLinkClassName}
        >
          {link.label}
        </Link>
      ))}
      <button
        onClick={onTermsClick}
        className={`${footerLinkClassName} uppercase`}
      >
        Terms
      </button>
    </div>
  );
}