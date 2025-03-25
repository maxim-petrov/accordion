/**
 * Token Aliases
 * 
 * This file contains user-friendly aliases for technical token names.
 * If an alias exists for a token, it will be displayed instead of the technical name.
 * If no alias exists, the original token name will be used.
 * 
 * Example:
 * "ACCORDION_CONTENT_TRANSITION_DURATION": "Opening speed"
 */

// Initialize with default aliases
const defaultAliases = {
  // Animation durations
  "ACCORDION_CONTENT_TRANSITION_DURATION": "Opening speed",
  "ACCORDION_ANIMATION_DURATION": "Animation duration",
  "ACCORDION_TRANSITION_DURATION": "Transition duration",
  
  // Easing functions
  "ACCORDION_CONTENT_TRANSITION_EASING": "Opening easing",
  "ACCORDION_TRANSITION_EASING": "Transition easing",
  "ACCORDION_CONTENT_OPACITY_EASING": "Fade easing",
  
  // Arrow animation
  "ACCORDION_ARROW_STIFFNESS": "Arrow bounce stiffness",
  "ACCORDION_ARROW_DAMPING": "Arrow bounce damping",
  "ACCORDION_ARROW_MASS": "Arrow weight",
  
  // Content animation
  "ACCORDION_CONTENT_STIFFNESS": "Content bounce stiffness",
  "ACCORDION_CONTENT_DAMPING": "Content bounce damping",
  "ACCORDION_CONTENT_MASS": "Content weight"
};

// Get stored aliases from localStorage if available
const loadStoredAliases = () => {
  try {
    const stored = localStorage.getItem('accordion_token_aliases');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load token aliases from localStorage:', error);
    return {};
  }
};

// Merge default aliases with stored aliases
const tokenAliases = {
  ...defaultAliases,
  ...loadStoredAliases()
};

// Save aliases to localStorage
const saveAliases = () => {
  try {
    localStorage.setItem('accordion_token_aliases', JSON.stringify(tokenAliases));
  } catch (error) {
    console.error('Failed to save token aliases to localStorage:', error);
  }
};

/**
 * Get a user-friendly alias for a token name
 * @param {string} tokenName - Original token name
 * @returns {string} - Alias if available, or original name
 */
export function getTokenAlias(tokenName) {
  return tokenAliases[tokenName] || tokenName;
}

/**
 * Get all available token aliases
 * @returns {Object} - Object containing all token aliases
 */
export function getAllAliases() {
  return { ...tokenAliases };
}

/**
 * Add or update a token alias
 * @param {string} tokenName - Original token name
 * @param {string} aliasName - User-friendly alias
 */
export function setTokenAlias(tokenName, aliasName) {
  tokenAliases[tokenName] = aliasName;
  saveAliases();
}

/**
 * Reset aliases to default values
 */
export function resetAliases() {
  Object.keys(tokenAliases).forEach(key => {
    if (defaultAliases[key]) {
      tokenAliases[key] = defaultAliases[key];
    } else {
      delete tokenAliases[key];
    }
  });
  saveAliases();
}

export default tokenAliases; 