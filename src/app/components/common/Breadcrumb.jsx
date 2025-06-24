"use client";
import Link from "next/link";

const Breadcrumb = ({ items, className = "" }) => {
  return (
    <nav className={`pt-32 pb-4 ${className}`}>
      <div className="flex items-center space-x-2 text-sm text-white/60">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <Link 
                href={item.href} 
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb; 