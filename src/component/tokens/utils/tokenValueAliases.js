const defaultValueAliases = {
  "stiff": "Быстрая (резкая)",     
  "moderate": "Средняя (умеренная)",
  "soft": "Медленная (плавная)"   
};

const loadStoredValueAliases = () => {
  try {
    const stored = localStorage.getItem('accordion_token_value_aliases');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load token value aliases from localStorage:', error);
    return {};
  }
};

const tokenValueAliases = {
  ...defaultValueAliases,
  ...loadStoredValueAliases()
};

const saveValueAliases = () => {
  try {
    localStorage.setItem('accordion_token_value_aliases', JSON.stringify(tokenValueAliases));
  } catch (error) {
    console.error('Failed to save token value aliases to localStorage:', error);
  }
};


export function getTokenValueAlias(tokenValue, tokenType = "spring") {
  if (tokenType === "spring" && tokenValueAliases[tokenValue]) {
    return `${tokenValueAliases[tokenValue]} (${tokenValue})`;
  }
  return null;
}


export function getTokenValueAliasOnly(tokenValue, tokenType = "spring") {
  if (tokenType === "spring" && tokenValueAliases[tokenValue]) {
    return tokenValueAliases[tokenValue];
  }
  return tokenValue;
}


export function getAllValueAliases(tokenType = "spring") {
  if (tokenType === "spring") {
    const springAliases = {};
    Object.keys(tokenValueAliases).forEach(key => {
      springAliases[key] = tokenValueAliases[key];
    });
    return springAliases;
  }
  return {};
}


export function setTokenValueAlias(tokenValue, aliasValue, tokenType = "spring") {
  if (tokenType === "spring") {
    tokenValueAliases[tokenValue] = aliasValue;
    saveValueAliases();
  }
}


export function resetValueAliases() {
  Object.keys(tokenValueAliases).forEach(key => {
    if (defaultValueAliases[key]) {
      tokenValueAliases[key] = defaultValueAliases[key];
    } else {
      delete tokenValueAliases[key];
    }
  });
  saveValueAliases();
} 