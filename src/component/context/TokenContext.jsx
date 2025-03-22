import { createContext, useState, useContext, useEffect } from 'react';
import { initializeTokenValues } from '../utils/tokenInitializer';

const TokenContext = createContext();

export function useTokens() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
}

export function TokenProvider({ children }) {
  const [tokenValues, setTokenValues] = useState(initializeTokenValues);

  useEffect(() => {
    Object.entries(tokenValues).forEach(([key, value]) => {
      const cssVarName = `--${key.toLowerCase().replace(/_/g, '-')}`;
      document.documentElement.style.setProperty(cssVarName, value);
      
      try {
        import('../tokens/utils/tokenUtils').then(module => {
          if (module.default && typeof module.default.updateToken === 'function') {
            module.default.updateToken(key, value);
          }
        });
      } catch (error) {
        console.error('Failed to update token in JS:', error);
      }
    });
  }, [tokenValues]);

  const handleTokenChange = (newTokenValues) => {
    setTokenValues(newTokenValues);
  };

  const value = {
    tokenValues,
    handleTokenChange
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
} 