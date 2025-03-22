import rootTokens from '../../tokens.json';
import componentTokens from '../tokens/tokens.json';


export function initializeTokenValues() {
  const initialTokens = {};
  Object.entries(componentTokens).forEach(([key, value]) => {
    if (typeof value === 'string' && value.startsWith('tokens.')) {
      const match = value.match(/tokens\.\w+\('([^']+)'\)/);
      if (match && match[1]) {
        const tokenKey = match[1];
        if (value.includes('duration')) {
          initialTokens[key] = rootTokens.duration[tokenKey] || value;
        } else if (value.includes('motion') || value.includes('easing')) {
          initialTokens[key] = rootTokens.motion[tokenKey] || value;
        } else {
          initialTokens[key] = value;
        }
      } else {
        initialTokens[key] = value;
      }
    } else {
      if (key.includes('SPRING_STIFFNESS') || key.includes('SPRING_DAMPING') || key.includes('SPRING_MASS')) {
        initialTokens[key] = parseFloat(value);
      } else {
        initialTokens[key] = value;
      }
    }
  });
  return initialTokens;
} 