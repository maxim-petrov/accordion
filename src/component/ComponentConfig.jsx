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
  // Track which tokens should be hidden (individual spring parameters when using presets)
  const [hiddenTokens, setHiddenTokens] = useState({
    ACCORDION_ARROW_STIFFNESS: true,
    ACCORDION_ARROW_DAMPING: true,
    ACCORDION_ARROW_MASS: true,
    ACCORDION_CONTENT_STIFFNESS: true,
    ACCORDION_CONTENT_DAMPING: true,
    ACCORDION_CONTENT_MASS: true
  });

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

  // Create spring options for stiffness, damping, and mass
  const availableSprings = Object.entries(rootTokens.spring).map(([type, values]) => ({
    type,
    stiffness: {
      label: `${type} spring (${values.stiffness})`,
      value: values.stiffness.toString()
    },
    damping: {
      label: `${type} spring (${values.damping})`,
      value: values.damping.toString()
    },
    mass: {
      label: `${type} spring (${values.mass})`,
      value: values.mass.toString()
    }
  }));

  // Create spring preset options
  const springPresets = Object.keys(rootTokens.spring).map(type => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),  // Capitalize
    value: type
  }));

  const handleTokenChange = (tokenName) => (e) => {
    let newValue = e.target.value;
    
    // Handle custom selection
    if (newValue === 'custom') {
      setCustomSelections(prev => ({
        ...prev,
        [tokenName]: true
      }));
      
      // If this is a preset selector, show the individual parameters
      if (tokenName === 'ACCORDION_ARROW_PRESET') {
        setHiddenTokens(prev => ({
          ...prev,
          ACCORDION_ARROW_STIFFNESS: false,
          ACCORDION_ARROW_DAMPING: false,
          ACCORDION_ARROW_MASS: false
        }));
      } else if (tokenName === 'ACCORDION_CONTENT_PRESET') {
        setHiddenTokens(prev => ({
          ...prev,
          ACCORDION_CONTENT_STIFFNESS: false,
          ACCORDION_CONTENT_DAMPING: false,
          ACCORDION_CONTENT_MASS: false
        }));
      }
      // Don't update the token value yet, wait for custom input
      return;
    } else {
      setCustomSelections(prev => ({
        ...prev,
        [tokenName]: false
      }));
      
      // If this is a preset selector, update all related spring properties
      let updatedValues = {
        ...tokenValues,
        [tokenName]: newValue
      };
      
      if (tokenName === 'ACCORDION_ARROW_PRESET' && rootTokens.spring[newValue]) {
        // Hide individual parameters when using a preset
        setHiddenTokens(prev => ({
          ...prev,
          ACCORDION_ARROW_STIFFNESS: true,
          ACCORDION_ARROW_DAMPING: true,
          ACCORDION_ARROW_MASS: true
        }));
        
        // Update the individual spring parameters to match the selected preset
        updatedValues = {
          ...updatedValues,
          ACCORDION_ARROW_STIFFNESS: rootTokens.spring[newValue].stiffness.toString(),
          ACCORDION_ARROW_DAMPING: rootTokens.spring[newValue].damping.toString(),
          ACCORDION_ARROW_MASS: rootTokens.spring[newValue].mass.toString()
        };
      } else if (tokenName === 'ACCORDION_CONTENT_PRESET' && rootTokens.spring[newValue]) {
        // Hide individual parameters when using a preset
        setHiddenTokens(prev => ({
          ...prev,
          ACCORDION_CONTENT_STIFFNESS: true,
          ACCORDION_CONTENT_DAMPING: true,
          ACCORDION_CONTENT_MASS: true
        }));
        
        // Update the individual spring parameters to match the selected preset
        updatedValues = {
          ...updatedValues,
          ACCORDION_CONTENT_STIFFNESS: rootTokens.spring[newValue].stiffness.toString(),
          ACCORDION_CONTENT_DAMPING: rootTokens.spring[newValue].damping.toString(),
          ACCORDION_CONTENT_MASS: rootTokens.spring[newValue].mass.toString()
        };
      }
      
      setTokenValues(updatedValues);
      return;
    }
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
    resetAliases();
    window.location.reload();
  };

  const handleSourceClick = () => {
    window.open('https://stackblitz.com/~/github.com/maxim-petrov/accordion', '_blank');
  };

  const allTokens = Object.entries(tokenValues);

  return (
    <div className="tokens-configurator">
      <div className="tokens-header">
        <h3>Настройки</h3>
        <button 
          className="reset-aliases-button" 
          onClick={handleResetAliases}
          title="Сбросить все алиасы до значений по умолчанию"
        >
          Reset
        </button>
        <button 
          className="reset-aliases-button" 
          onClick={handleSourceClick}
          title="Исходные значения"
        >
          Source
        </button>
      </div>
      
      <div className="tokens-section">        
        <div className="tokens-flat-list">
          {allTokens.map(([tokenName, tokenValue]) => {
            const isEasing = tokenName.includes('EASING') || tokenName.includes('MOTION');
            const isDuration = tokenName.includes('DURATION');
            const isPreset = tokenName.includes('PRESET');
            const isSpringParam = tokenName.includes('STIFFNESS') || tokenName.includes('DAMPING') || tokenName.includes('MASS');
            const displayName = getAlias(tokenName);
            const isCustom = customSelections[tokenName];
            
            // Skip hidden tokens (individual spring parameters when using presets)
            if (hiddenTokens[tokenName]) {
              return null;
            }
            
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
                      {isPreset && springPresets.map(preset => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                      {isSpringParam && availableSprings.map(spring => {
                        if (tokenName.includes('STIFFNESS')) {
                          return (
                            <option key={spring.type + '-stiffness'} value={spring.stiffness.value}>
                              {spring.stiffness.label}
                            </option>
                          );
                        } else if (tokenName.includes('DAMPING')) {
                          return (
                            <option key={spring.type + '-damping'} value={spring.damping.value}>
                              {spring.damping.label}
                            </option>
                          );
                        } else if (tokenName.includes('MASS')) {
                          return (
                            <option key={spring.type + '-mass'} value={spring.mass.value}>
                              {spring.mass.label}
                            </option>
                          );
                        }
                        return null;
                      })}
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