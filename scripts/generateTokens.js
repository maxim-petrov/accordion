import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const COMPONENT_TOKENS_PATH = path.resolve('src/component/tokens/tokens.json');
const ROOT_TOKENS_PATH = path.resolve('src/tokens.json');
const JS_UTILS_PATH = path.resolve('src/component/tokens/utils/tokenUtils.js');
const SCSS_UTILS_PATH = path.resolve('src/component/tokens/utils/tokenUtils.scss');

export async function generateTokenFiles() {
  try {
    const rootTokens = JSON.parse(fs.readFileSync(ROOT_TOKENS_PATH, 'utf8'));
    const componentTokens = JSON.parse(fs.readFileSync(COMPONENT_TOKENS_PATH, 'utf8'));
    
    const processedTokens = {};
    
    for (const [key, valueExpr] of Object.entries(componentTokens)) {
      if (typeof valueExpr === 'string') {
        const match = valueExpr.match(/tokens\.(\w+)\('(.+)'\)/);
        if (match) {
          const [, category, tokenValue] = match;
          if (rootTokens[category] && rootTokens[category][tokenValue] !== undefined) {
            processedTokens[key] = rootTokens[category][tokenValue];
          } else {
            console.warn(`Token not found for ${category}.${tokenValue}`);
            processedTokens[key] = valueExpr; 
          }
        } else {
          processedTokens[key] = valueExpr; 
        }
      } else {
        processedTokens[key] = valueExpr; 
      }
    }
    
    generateJSTokens(processedTokens);
    
    generateSCSSTokens(processedTokens);
    
    console.log('✅ Tokens successfully generated');
    return true;
  } catch (error) {
    console.error('❌ Error generating tokens:', error);
    return false;
  }
}

function generateJSTokens(processedTokens) {
  const jsContent = `import rootTokens from '../../../tokens.json';

const parseTokenValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  
  if (value.endsWith('ms')) {
    const match = value.match(/^(\\d+)ms$/);
    if (match) {
      return value; 
    }
  }
  
  if (value.startsWith('cubic-bezier')) {
    return value;
  }
  
  return value;
};

const processedTokens = ${JSON.stringify(processedTokens, null, 2)};

processedTokens.updateToken = function(tokenName, tokenValue) {
  if (this.hasOwnProperty(tokenName)) {
    this[tokenName] = parseTokenValue(tokenValue);
    return true;
  }
  return false;
};

console.log('TokenUtils loaded with values:', processedTokens);

export default processedTokens;`;

  fs.writeFileSync(JS_UTILS_PATH, jsContent);
}

function generateSCSSTokens(processedTokens) {
  let cssVars = ':root {\n';
  let scssVars = '\n';
  
  const sortedKeys = Object.keys(processedTokens).sort();
  
  for (const key of sortedKeys) {
    if (key === 'updateToken') continue; 
    
    const cssVarName = `--${key.toLowerCase().replace(/_/g, '-')}`;
    
    cssVars += `  ${cssVarName}: ${processedTokens[key]};\n`;
    
    scssVars += `$${key}: var(${cssVarName});\n`;
  }
  
  cssVars += '}';
  const scssContent = cssVars + scssVars;
  
  fs.writeFileSync(SCSS_UTILS_PATH, scssContent);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateTokenFiles();
} 
