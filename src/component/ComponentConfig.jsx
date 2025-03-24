import { useState, useEffect } from 'react';
import rootTokens from '../tokens.json';
import { useTokens } from './context/TokenContext';
import { resetAliases } from './tokens/utils/tokenAliases';

function TokenConfig() {
  const { 
    tokenValues: initialTokenValues, 
    handleTokenChange: onTokenChange,
    tokenAliases,
    handleAliasChange,
    getAlias
  } = useTokens();
  const [tokenValues, setTokenValues] = useState(initialTokenValues);
  const [isEditingAlias, setIsEditingAlias] = useState({});
  const [aliasEdits, setAliasEdits] = useState({});
  const [customSelections, setCustomSelections] = useState({});

  useEffect(() => {
    onTokenChange(tokenValues);
  }, [tokenValues, onTokenChange]);

  const availableDurations = Object.entries(rootTokens.duration).map(([key, value]) => ({
    label: `${key} (${value})`,
    value: value
  }));

  const availableMotions = Object.entries(rootTokens.motion).map(([key, value]) => ({
    label: `${key} (${value})`,
    value: value
  }));

  const handleTokenChange = (tokenName) => (e) => {
    let newValue = e.target.value;
    
    // Handle custom selection
    if (newValue === 'custom') {
      setCustomSelections(prev => ({
        ...prev,
        [tokenName]: true
      }));
      // Don't update the token value yet, wait for custom input
      return;
    } else {
      setCustomSelections(prev => ({
        ...prev,
        [tokenName]: false
      }));
    }
    
    setTokenValues(prev => ({
      ...prev,
      [tokenName]: newValue
    }));
  };

  const handleCustomInputChange = (tokenName) => (e) => {
    const newValue = e.target.value;
    setTokenValues(prev => ({
      ...prev,
      [tokenName]: newValue
    }));
  };

  const startEditingAlias = (tokenName) => {
    setIsEditingAlias(prev => ({
      ...prev,
      [tokenName]: true
    }));
    setAliasEdits(prev => ({
      ...prev,
      [tokenName]: getAlias(tokenName)
    }));
  };

  const stopEditingAlias = (tokenName) => {
    setIsEditingAlias(prev => ({
      ...prev,
      [tokenName]: false
    }));
    
    // Save the alias if it was changed
    if (aliasEdits[tokenName] && aliasEdits[tokenName] !== getAlias(tokenName)) {
      handleAliasChange(tokenName, aliasEdits[tokenName]);
    }
  };

  const handleAliasEdit = (tokenName) => (e) => {
    setAliasEdits(prev => ({
      ...prev,
      [tokenName]: e.target.value
    }));
  };

  const handleResetAliases = () => {
    if (window.confirm("Are you sure you want to reset all aliases to their default values?")) {
      resetAliases();
      window.location.reload(); // Reload to update the UI with reset aliases
    }
  };

  const allTokens = Object.entries(tokenValues);

  return (
    <div className="tokens-configurator">
      <div className="tokens-header">
        <h3>Настройки</h3>
        <button 
          className="reset-aliases-button" 
          onClick={handleResetAliases}
          title="Reset all aliases to default values"
        >
          Reset Aliases
        </button>
      </div>
      
      <div className="tokens-section">        
        <div className="tokens-flat-list">
          {allTokens.map(([tokenName, tokenValue]) => {
            const isEasing = tokenName.includes('EASING') || tokenName.includes('MOTION');
            const isDuration = tokenName.includes('DURATION');
            const displayName = getAlias(tokenName);
            const isCustom = customSelections[tokenName];
            
            return (
              <div className="token-group" key={tokenName}>
                <div className="token-description">
                  <label htmlFor={`token-${tokenName}`}>
                    {isEditingAlias[tokenName] ? (
                      <input
                        type="text"
                        value={aliasEdits[tokenName] || displayName}
                        onChange={handleAliasEdit(tokenName)}
                        onBlur={() => stopEditingAlias(tokenName)}
                        onKeyDown={(e) => e.key === 'Enter' && stopEditingAlias(tokenName)}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => startEditingAlias(tokenName)}>
                        {displayName}
                      </span>
                    )}
                  </label>
                </div>
                <div className="token-controls">
                  <select 
                    id={`token-${tokenName}`}
                    value={isCustom ? 'custom' : tokenValue}
                    onChange={handleTokenChange(tokenName)}
                  >
                    <optgroup label="Из tokens.json">
                      {isEasing && availableMotions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                      {isDuration && availableDurations.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                    <option value="custom">Custom</option>
                  </select>
                  
                  {isCustom && (
                    <input
                      type="text"
                      className="token-custom-value"
                      value={tokenValue}
                      onChange={handleCustomInputChange(tokenName)}
                      placeholder="Введите значение"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TokenConfig; 