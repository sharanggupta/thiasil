/**
 * Formats a date into a readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Checks if a date has expired (is in the past)
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is expired
 */
export const isExpired = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
}; 