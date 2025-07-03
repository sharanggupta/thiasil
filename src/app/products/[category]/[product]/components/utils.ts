// Utility functions for product details
import { extractPriceFromString, formatPrice } from '@/lib/utils';

export function parseNumber(str: string | null | undefined): number | null {
  // Extract the first number from a string (e.g., '36 pieces' -> 36)
  if (!str) return null;
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

// Use the centralized price parsing function
export function parsePrice(str: string | null | undefined): number | null {
  if (!str) return null;
  return extractPriceFromString(str);
}

// Use the centralized price formatting function
export function formatRupee(val: number | null): string {
  if (val == null) return "-";
  return formatPrice(val);
}

export function calculateTotalCost(packaging: string | null | undefined, price: string | null | undefined): number | null {
  const packagingQty = parseNumber(packaging);
  const pricePerPiece = parsePrice(price);
  return (packagingQty && pricePerPiece) ? (packagingQty * pricePerPiece) : null;
}

export function createPrefillMessage(variant: any, totalCost: number | null): string {
  return encodeURIComponent(
    `Product Inquiry:\n` +
    `Name: ${variant.name || ''}\n` +
    `Cat No: ${variant.catNo || ''}\n` +
    `Capacity: ${variant.capacity || ''}\n` +
    `Packaging: ${variant.packaging || ''}\n` +
    `Price per piece: ${variant.price || ''}\n` +
    (totalCost ? `Total cost for one pack: ${formatRupee(totalCost)}` : '')
  );
}