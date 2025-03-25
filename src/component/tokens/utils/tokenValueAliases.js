/**
 * Token Value Aliases
 * 
 * This file contains user-friendly aliases for token values (not token names).
 * For example, spring presets like "stiff", "moderate", "soft" can have
 * more user-friendly or localized display names.
 */

// Default value aliases for spring presets
const defaultValueAliases = {
  // Spring presets
  "very_fast": "Очень быстрая",      // Very Fast
  "stiff": "Быстрая (резкая)",     // Fast
  "moderate": "Средняя (умеренная)",  // Medium
  "soft": "Медленная (плавная)",     // Slow
  "very_slow": "Очень медленная"      // Very Slow
};

// Get stored value aliases from localStorage if available
const loadStoredValueAliases = () => {
  try {
    const stored = localStorage.getItem('accordion_token_value_aliases');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load token value aliases from localStorage:', error);
    return {};
  }
};

// Merge default aliases with stored aliases
const tokenValueAliases = {
  ...defaultValueAliases,
  ...loadStoredValueAliases()
};

// Save value aliases to localStorage
const saveValueAliases = () => {
  try {
    localStorage.setItem('accordion_token_value_aliases', JSON.stringify(tokenValueAliases));
  } catch (error) {
    console.error('Failed to save token value aliases to localStorage:', error);
  }
};

/**
 * Get a user-friendly alias for a token value
 * @param {string} tokenValue - Original token value
 * @param {string} tokenType - Type of token (e.g., "spring")
 * @returns {string} - Alias if available, or original value
 */
export function getTokenValueAlias(tokenValue, tokenType = "spring") {
  if (tokenType === "spring" && tokenValueAliases[tokenValue]) {
    return `${tokenValueAliases[tokenValue]} (${tokenValue})`;
  }
  return null; // Return null if no alias found
}

/**
 * Get just the alias part without the original value
 * @param {string} tokenValue - Original token value
 * @param {string} tokenType - Type of token (e.g., "spring")
 * @returns {string} - Alias if available, or original value
 */
export function getTokenValueAliasOnly(tokenValue, tokenType = "spring") {
  if (tokenType === "spring" && tokenValueAliases[tokenValue]) {
    return tokenValueAliases[tokenValue];
  }
  return tokenValue; // Return original value if no alias found
}

/**
 * Get all available token value aliases
 * @param {string} tokenType - Type of token (e.g., "spring")
 * @returns {Object} - Object containing all token value aliases for the specified type
 */
export function getAllValueAliases(tokenType = "spring") {
  if (tokenType === "spring") {
    const springAliases = {};
    Object.keys(tokenValueAliases).forEach(key => {
      springAliases[key] = tokenValueAliases[key];
    });
    return springAliases;
  }
  return {};
}

/**
 * Add or update a token value alias
 * @param {string} tokenValue - Original token value
 * @param {string} aliasValue - User-friendly alias
 * @param {string} tokenType - Type of token (e.g., "spring")
 */
export function setTokenValueAlias(tokenValue, aliasValue, tokenType = "spring") {
  if (tokenType === "spring") {
    tokenValueAliases[tokenValue] = aliasValue;
    saveValueAliases();
  }
}

/**
 * Reset value aliases to default values
 */
export function resetValueAliases() {
  Object.keys(tokenValueAliases).forEach(key => {
    if (defaultValueAliases[key]) {
      tokenValueAliases[key] = defaultValueAliases[key];
    } else {
      delete tokenValueAliases[key];
    }
  });
  saveValueAliases();
} 