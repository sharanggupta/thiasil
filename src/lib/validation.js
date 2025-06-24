import { VALIDATION } from './constants';

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '').trim();
};

export const validateEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePrice = (price) => {
  return VALIDATION.PRICE_REGEX.test(price);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Please upload an image smaller than 5MB.' };
  }
  
  return { valid: true };
}; 