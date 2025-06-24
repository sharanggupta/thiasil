export const extractPriceFromString = (priceString) => {
  if (!priceString) return 0;
  if (typeof priceString === 'number') return priceString;
  const match = priceString.match(/₹([\d,.]+)/);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
};

export const formatPrice = (price) => {
  if (!price) return '₹0.00';
  const numPrice = typeof price === 'string' ? extractPriceFromString(price) : price;
  return `₹${numPrice.toFixed(2)}`;
};

export const applyDiscountToPrice = (price, discountPercent) => {
  if (!price || !discountPercent) return price;
  const numPrice = extractPriceFromString(price);
  const discountedPrice = numPrice * (1 - discountPercent / 100);
  return formatPrice(discountedPrice);
};

export const applyDiscountToPriceRange = (priceRange, discountPercent) => {
  if (!priceRange || !discountPercent) return priceRange;
  const numbers = priceRange.match(/₹(\d+\.?\d*)/g);
  if (!numbers || numbers.length === 0) return priceRange;
  const discountedPrices = numbers.map(price => {
    const numPrice = parseFloat(price.replace('₹', ''));
    const discountedPrice = numPrice * (1 - discountPercent / 100);
    return `₹${discountedPrice.toFixed(2)}`;
  });
  return discountedPrices.join(' - ');
}; 