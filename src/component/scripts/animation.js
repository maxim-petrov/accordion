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

export const getArrowAnimationConfig = (tokens) => ({
  transition: {
    type: "spring",
    stiffness: parseFloat(tokens.ACCORDION_ARROW_STIFFNESS),
    damping: parseFloat(tokens.ACCORDION_ARROW_DAMPING),
    mass: parseFloat(tokens.ACCORDION_ARROW_MASS)
  }
});

export const getContentAnimationConfig = (tokens, contentHeight = 0) => {
  const baseDamping = parseFloat(tokens.ACCORDION_CONTENT_DAMPING);
  
  const calculateDynamicDamping = (height) => {
    const minHeight = 100;
    const maxHeight = 800;
    
    const maxDampingMultiplier = 2.5;
    
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
  
  const dynamicDamping = calculateDynamicDamping(contentHeight);
  
  return {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: {
      height: {
        type: "spring",
        stiffness: parseFloat(tokens.ACCORDION_CONTENT_STIFFNESS),
        damping: dynamicDamping,
        mass: parseFloat(tokens.ACCORDION_CONTENT_MASS),
      },
      opacity: {
        duration: extractMs(tokens.ACCORDION_CONTENT_OPACITY_DURATION) / 1000,
        ease: tokens.ACCORDION_CONTENT_OPACITY_EASING
      }
    },
    style: { overflow: "hidden" }
  };
};

const staticTokens = tokens;

export const accordionAnimationConfig = getAccordionTransitionConfig(staticTokens);
export const arrowAnimation = getArrowAnimationConfig(staticTokens);
export const contentAnimation = getContentAnimationConfig(staticTokens, 0);

export const getContentAnimationWithHeight = (height) => getContentAnimationConfig(staticTokens, height);
