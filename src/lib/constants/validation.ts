// Form Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  PRICE_REGEX: /^₹?\d+(\.\d{1,2})?$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;