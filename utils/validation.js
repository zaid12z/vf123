/**
 * Validation utilities
 */

/**
 * Validate username format
 * Only allows letters, numbers, underscores, and hyphens
 * @param {string} username 
 * @returns {boolean}
 */
function validateUsername(username) {
  const usernameRegex = /^[A-Za-z0-9_-]+$/;
  return usernameRegex.test(username);
}

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
function validateEmail(email) {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

module.exports = {
  validateUsername,
  validateEmail
};