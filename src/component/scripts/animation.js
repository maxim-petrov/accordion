import { useEffect, useState } from 'react';
import tokens from '../tokens/utils/tokenUtils.js';
import { extractMs } from './utils.js';

export const useAccordionAnimation = (customDuration = null, customTransitionDuration = null) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      let animationDuration;
      
      if (customTransitionDuration) {
        animationDuration = extractMs(customTransitionDuration);
      } else if (customDuration) {
        animationDuration = extractMs(customDuration);
      } else {
        animationDuration = extractMs(tokens.ACCORDION_TRANSITION_DURATION) ||
                          parseInt(tokens.ACCORDION_ANIMATION_DURATION);
      }

      const durationWithBuffer = animationDuration + 100;

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, durationWithBuffer);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, customDuration, customTransitionDuration]);

  const startAnimation = () => setIsAnimating(true);

  const stopAnimation = () => setIsAnimating(false);

  return [isAnimating, startAnimation, stopAnimation];
};

export const getAccordionTransitionConfig = (tokens) => ({
  type: "tween",
  duration: extractMs(tokens.ACCORDION_TRANSITION_DURATION) / 1000,
  ease: tokens.ACCORDION_TRANSITION_EASING
});

export const getArrowAnimationConfig = (tokenValues) => ({
  transition: {
    type: "spring",
    stiffness: parseFloat(tokenValues.ACCORDION_ARROW_STIFFNESS),
    damping: parseFloat(tokenValues.ACCORDION_ARROW_DAMPING),
    mass: parseFloat(tokenValues.ACCORDION_ARROW_MASS)
  }
});

export const calculateDynamicDamping = (height, baseDamping, maxDampingMultiplier) => {
  const minHeight = 100;
  const maxHeight = 800;
  
  if (height <= minHeight) {
    return baseDamping;
  } else if (height >= maxHeight) {
    return baseDamping * maxDampingMultiplier;
  } else {
    const heightRatio = (height - minHeight) / (maxHeight - minHeight);
    const dampingMultiplier = 1 + (heightRatio * (maxDampingMultiplier - 1));
    return baseDamping * dampingMultiplier;
  }
};

export const getContentAnimationConfig = (tokenValues, contentHeight = 0) => {
  const baseDamping = parseFloat(tokenValues.ACCORDION_CONTENT_DAMPING);
  const dynamicDamping = calculateDynamicDamping(contentHeight, baseDamping);
  
  return {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: {
      height: {
        type: "spring",
        stiffness: parseFloat(tokenValues.ACCORDION_CONTENT_STIFFNESS),
        damping: dynamicDamping,
        mass: parseFloat(tokenValues.ACCORDION_CONTENT_MASS),
      },
      opacity: {
        duration: extractMs(tokenValues.ACCORDION_CONTENT_OPACITY_DURATION) / 1000,
        ease: tokenValues.ACCORDION_CONTENT_OPACITY_EASING
      }
    },
    style: { overflow: "hidden" }
  };
};

const staticTokens = tokens;

export const accordionAnimationConfig = getAccordionTransitionConfig(staticTokens);
export const arrowAnimation = getArrowAnimationConfig(staticTokens);
export const contentAnimation = getContentAnimationConfig(staticTokens, 0);

export const getContentAnimationWithHeight = (height, customTokenValues = null) => {
  const tokenValues = customTokenValues || staticTokens;
  return getContentAnimationConfig(tokenValues, height);
};
