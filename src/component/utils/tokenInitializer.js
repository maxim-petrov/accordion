import rootTokens from '../../tokens.json';
import componentTokens from '../tokens/tokens.json';


export function initializeTokenValues() {
  const initialTokens = {};
  Object.entries(componentTokens).forEach(([key, value]) => {
    if (typeof value === 'string' && value.startsWith('tokens.')) {
      if (value.startsWith('tokens.spring')) {
        const match = value.match(/tokens\.spring\('(.+?)'\)\.(.+)/);
        if (match && match.length === 3) {
          const springType = match[1];
          const property = match[2];
          
          if (rootTokens.spring && rootTokens.spring[springType] && rootTokens.spring[springType][property] !== undefined) {
            initialTokens[key] = rootTokens.spring[springType][property].toString();
          } else {
            initialTokens[key] = value;
          }
        } else {
          initialTokens[key] = value;
        }
      } else {
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
      }
    } else {
      if (key.includes('STIFFNESS') || key.includes('DAMPING') || key.includes('MASS')) {
        initialTokens[key] = parseFloat(value);
      } else {
        initialTokens[key] = value;
      }
    }
  });
  return initialTokens;
} 