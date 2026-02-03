/**
 * Validation helper functions
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {object} { isValid: boolean, errors: string[] }
 */
const validatePassword = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate required fields
 * @param {object} data - Request body data
 * @param {array} requiredFields - Array of field names required
 * @returns {object} { isValid: boolean, errors: string[] }
 */
const validateRequiredFields = (data, requiredFields) => {
  const errors = [];

  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate positive number
 * @param {number} num
 * @param {string} fieldName
 * @returns {object} { isValid: boolean, error: string|null }
 */
const validatePositiveNumber = (num, fieldName = 'Value') => {
  if (num === null || num === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (isNaN(num) || num <= 0) {
    return { isValid: false, error: `${fieldName} must be a positive number` };
  }
  return { isValid: true, error: null };
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} dateString
 * @returns {object} { isValid: boolean, error: string|null }
 */
const validateDate = (dateString) => {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return { isValid: false, error: 'Date must be in YYYY-MM-DD format' };
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }
  return { isValid: true, error: null };
};

/**
 * Sanitize string input (prevent XSS)
 * @param {string} str
 * @returns {string}
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequiredFields,
  validatePositiveNumber,
  validateDate,
  sanitizeString
};
