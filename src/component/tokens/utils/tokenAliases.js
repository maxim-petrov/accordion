const defaultAliases = {
  "ACCORDION_CONTENT_TRANSITION_DURATION": "Opening speed",
  "ACCORDION_ANIMATION_DURATION": "Animation duration",
  "ACCORDION_TRANSITION_DURATION": "Скорость закрытия аккордеона",
  
  "ACCORDION_CONTENT_TRANSITION_EASING": "Opening easing",
  "ACCORDION_TRANSITION_EASING": "Плавность закрытия аккордеона",
  "ACCORDION_CONTENT_OPACITY_EASING": "Fade easing",
  
  "ACCORDION_ARROW_PRESET": "Анимация стрелки",
  "ACCORDION_CONTENT_PRESET": "Анимация контента",
  
  "ACCORDION_ARROW_STIFFNESS": "Arrow stiffness",
  "ACCORDION_ARROW_DAMPING": "Arrow damping",
  "ACCORDION_ARROW_MASS": "Arrow mass",
  "ACCORDION_CONTENT_STIFFNESS": "Content stiffness",
  "ACCORDION_CONTENT_DAMPING": "Content damping",
  "ACCORDION_CONTENT_MASS": "Content mass",

  "ACCORDION_TEXT_TRANSITION_DURATION": "Скорость скрытия текста",
  "ACCORDION_TEXT_TRANSITION_EASING": "Плавность скрытия текста",

  "ACCORDION_TEXT_SHOW_TRANSITION_DURATION": "Скорость появления текста",
  "ACCORDION_TEXT_SHOW_TRANSITION_EASING": "Плавность появления текста",
};

const loadStoredAliases = () => {
  try {
    const stored = localStorage.getItem('accordion_token_aliases');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load token aliases from localStorage:', error);
    return {};
  }
};

const tokenAliases = {
  ...defaultAliases,
  ...loadStoredAliases()
};

const saveAliases = () => {
  try {
    localStorage.setItem('accordion_token_aliases', JSON.stringify(tokenAliases));
  } catch (error) {
    console.error('Failed to save token aliases to localStorage:', error);
  }
};


export function getTokenAlias(tokenName) {
  return tokenAliases[tokenName] || tokenName;
}


export function getAllAliases() {
  return { ...tokenAliases };
}


export function setTokenAlias(tokenName, aliasName) {
  tokenAliases[tokenName] = aliasName;
  saveAliases();
}

export function resetAliases() {
  Object.keys(tokenAliases).forEach(key => {
    if (defaultAliases[key]) {
      tokenAliases[key] = defaultAliases[key];
    } else {
      delete tokenAliases[key];
    }
  });
  saveAliases();
}

export default tokenAliases; 