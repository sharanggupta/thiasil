"use client";
import { getStockStatusDisplay } from "../../../lib/utils";

const statusExplanations = {
  in_stock: 'Product is available and ready to ship.',
  out_of_stock: 'Product is currently unavailable.',
  made_to_order: 'Product is manufactured after order is placed.',
  limited_stock: 'Only a few units left in stock.'
};

const StockStatusBadge = ({ status, className = "" }) => {
  const { label, className: statusClassName } = getStockStatusDisplay(status);
  const explanation = statusExplanations[status] || '';
  return (
    <span className={`relative inline-block px-3 py-1 rounded-full text-xs font-medium ${statusClassName} min-w-[100px] text-center ${className} group`}>
      {label}
      {explanation && (
        <span className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 hidden group-hover:flex px-4 py-2 rounded-xl bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-normal shadow-lg transition-all duration-200 whitespace-nowrap pointer-events-none">
          {explanation}
        </span>
      )}
    </span>
  );
};

export default StockStatusBadge; 