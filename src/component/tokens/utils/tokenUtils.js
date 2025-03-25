import rootTokens from '../../../tokens.json';

const parseTokenValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  
  if (value.endsWith('ms')) {
    const match = value.match(/^(\d+)ms$/);
    if (match) {
      return value; 
    }
  }
  
  if (value.startsWith('cubic-bezier')) {
    return value;
  }
  
  return value;
};

const processedTokens = {
  "ACCORDION_ARROW_PRESET": "stiff",
  "ACCORDION_ARROW_STIFFNESS": {
    "stiffness": 290,
    "damping": 22.22,
    "mass": 1
  },
  "ACCORDION_ARROW_DAMPING": {
    "stiffness": 290,
    "damping": 22.22,
    "mass": 1
  },
  "ACCORDION_ARROW_MASS": {
    "stiffness": 290,
    "damping": 22.22,
    "mass": 1
  },
  "ACCORDION_CONTENT_PRESET": "moderate",
  "ACCORDION_CONTENT_STIFFNESS": {
    "stiffness": 210,
    "damping": 20,
    "mass": 1
  },
  "ACCORDION_CONTENT_DAMPING": {
    "stiffness": 210,
    "damping": 20,
    "mass": 1
  },
  "ACCORDION_CONTENT_MASS": {
    "stiffness": 210,
    "damping": 20,
    "mass": 1
  },
  "ACCORDION_TRANSITION_DURATION": "250ms",
  "ACCORDION_TRANSITION_EASING": "cubic-bezier(.165, .84, .44, 1)",
  "ACCORDION_TEXT_TRANSITION_DURATION": "250ms",
  "ACCORDION_TEXT_TRANSITION_EASING": "cubic-bezier(.165, .84, .44, 1)",
  "ACCORDION_TEXT_SHOW_TRANSITION_DURATION": "250ms",
  "ACCORDION_TEXT_SHOW_TRANSITION_EASING": "cubic-bezier(.165, .84, .44, 1)"
};

processedTokens.updateToken = function(tokenName, tokenValue) {
  if (this.hasOwnProperty(tokenName)) {
    this[tokenName] = parseTokenValue(tokenValue);
    return true;
  }
  return false;
};

console.log('TokenUtils loaded with values:', processedTokens);

export default processedTokens;