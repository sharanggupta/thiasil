"use client";
import { getStockStatusDisplay } from "../../../lib/utils";

const StockStatusBadge = ({ status, className = "" }) => {
  const { label, className: statusClassName } = getStockStatusDisplay(status);

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusClassName} min-w-[100px] text-center ${className}`}>
      {label}
    </span>
  );
};

export default StockStatusBadge; 