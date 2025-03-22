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
  "ACCORDION_CONTENT_TRANSITION_DURATION": "250ms",
  "ACCORDION_CONTENT_TRANSITION_EASING": "cubic-bezier(0.32, 1.72, 0, 1)",
  "ACCORDION_CONTENT_OPACITY_DURATION": "150ms",
  "ACCORDION_CONTENT_OPACITY_EASING": "cubic-bezier(.165, .84, .44, 1)",
  "ACCORDION_ARROW_ROTATION_DURATION": "150ms",
  "ACCORDION_ARROW_ROTATION_EASING": "cubic-bezier(0.32, 1.72, 0, 1)",
  "ACCORDION_ARROW_STIFFNESS": "290",
  "ACCORDION_ARROW_DAMPING": "22",
  "ACCORDION_ARROW_MASS": "1",
  "ACCORDION_ANIMATION_DURATION": "250ms",
  "ACCORDION_TRANSITION_DURATION": "250ms",
  "ACCORDION_TRANSITION_EASING": "cubic-bezier(.165, .84, .44, 1)"
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