import { createContext, useState, useContext, useEffect } from 'react';
import { initializeTokenValues } from '../utils/tokenInitializer';
import { getTokenAlias, setTokenAlias, getAllAliases } from '../tokens/utils/tokenAliases';
import { getTokenValueAlias, setTokenValueAlias, getAllValueAliases } from '../tokens/utils/tokenValueAliases';

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
  const [tokenAliases, setTokenAliases] = useState(getAllAliases());
  const [valueAliases, setValueAliases] = useState(getAllValueAliases());

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

  const handleAliasChange = (tokenName, aliasName) => {
    setTokenAlias(tokenName, aliasName);
    setTokenAliases({...tokenAliases, [tokenName]: aliasName});
  };

  const getAlias = (tokenName) => {
    return getTokenAlias(tokenName);
  };

  const handleValueAliasChange = (tokenValue, aliasValue, tokenType = "spring") => {
    setTokenValueAlias(tokenValue, aliasValue, tokenType);
    setValueAliases(getAllValueAliases(tokenType));
  };

  const getValueAlias = (tokenValue, tokenType = "spring") => {
    return getTokenValueAlias(tokenValue, tokenType);
  };

  const value = {
    tokenValues,
    tokenAliases,
    valueAliases,
    handleTokenChange,
    handleAliasChange,
    handleValueAliasChange,
    getAlias,
    getValueAlias
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
} 