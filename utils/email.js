/**
 * Email utilities
 */

/**
 * Normalize email for storage and comparison
 * Handles Gmail's dot-insensitive addressing
 * @param {string} email 
 * @returns {string}
 */
function normalizeEmail(email) {
  if (!email) return '';
  
  const [localPart, domain] = email.toLowerCase().split('@');
  if (!localPart || !domain) return email.toLowerCase();

  // For Gmail addresses, remove dots and everything after +
  if (domain === 'gmail.com') {
    const cleanLocalPart = localPart
      .split('+')[0]           // Remove everything after +
      .split('.')
      .join('');              // Remove all dots
    return `${cleanLocalPart}@${domain}`;
  }

  // For other email providers, just lowercase
  return `${localPart}@${domain}`;
}

/**
 * Format email for display (preserves original format)
 * @param {string} email 
 * @returns {string}
 */
function formatEmail(email) {
  return email || '';
}

module.exports = {
  normalizeEmail,
  formatEmail
};