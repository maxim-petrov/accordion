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
    duration: extractMs(tokens.ACCORDION_ARROW_ROTATION_DURATION) / 1000,
    ease: tokens.ACCORDION_ARROW_ROTATION_EASING,
    type: "spring",
    stiffness: tokens.ACCORDION_ARROW_STIFFNESS,
    damping: tokens.ACCORDION_ARROW_DAMPING,
    mass: tokens.ACCORDION_ARROW_MASS
  }
});

export const getContentAnimationConfig = (tokens) => ({
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: {
    height: {
      duration: extractMs(tokens.ACCORDION_CONTENT_TRANSITION_DURATION) / 1000,
      ease: "easeInOut",
      type: "tween"
    },
    opacity: {
      duration: extractMs(tokens.ACCORDION_CONTENT_OPACITY_DURATION) / 1000,
      ease: tokens.ACCORDION_CONTENT_OPACITY_EASING
    }
  },
  style: { overflow: "hidden" }
});

// For creating static exports, get tokens at module load time
const staticTokens = tokens;

// Export pre-configured animations with current CSS variable values
export const accordionAnimationConfig = getAccordionTransitionConfig(staticTokens);
export const arrowAnimation = getArrowAnimationConfig(staticTokens);
export const contentAnimation = getContentAnimationConfig(staticTokens);
