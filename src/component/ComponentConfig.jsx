import { useState, useEffect } from 'react';
import rootTokens from '../tokens.json';
import { useTokens } from './context/TokenContext';

function TokenConfig() {
  const { tokenValues: initialTokenValues, handleTokenChange: onTokenChange } = useTokens();
  const [tokenValues, setTokenValues] = useState(initialTokenValues);

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
    setTokenValues(prev => ({
      ...prev,
      [tokenName]: newValue
    }));
  };

  const allTokens = Object.entries(tokenValues);

  return (
    <div className="tokens-configurator">
      <h3>Настройка токенов анимации</h3>
      
      <div className="tokens-section">
        <h4>Токены анимации</h4>
        
        <div className="tokens-flat-list">
          {allTokens.map(([tokenName, tokenValue]) => {
            const isEasing = tokenName.includes('EASING') || tokenName.includes('MOTION');
            const isDuration = tokenName.includes('DURATION');
            
            return (
              <div className="token-group" key={tokenName}>
                <div className="token-description">
                  <label htmlFor={`token-${tokenName}`}>{tokenName}</label>
                  <span className="token-technical-name">{tokenName}</span>
                </div>
                <div className="token-controls">
                  <select 
                    id={`token-${tokenName}`}
                    value={tokenValue}
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
                  </select>
                  
                  <input
                    type="text"
                    className="token-custom-value"
                    value={tokenValue}
                    onChange={handleTokenChange(tokenName)}
                    placeholder="Введите значение"
                  />
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