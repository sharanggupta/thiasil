export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error. Please check your connection.';
  }
  return error.message || 'An unexpected error occurred.';
}; 