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
  // Get base damping value
  const baseDamping = parseFloat(tokens.ACCORDION_CONTENT_DAMPING);
  
  // Calculate dynamic damping based on content height
  const calculateDynamicDamping = (height) => {
    // Define thresholds for scaling damping
    const minHeight = 100; // px - below this we use base damping
    const maxHeight = 800; // px - above this we cap the damping increase
    
    // Maximum damping multiplier
    const maxDampingMultiplier = 2.5;
    
    if (height <= minHeight) {
      return baseDamping;
    } else if (height >= maxHeight) {
      return baseDamping * maxDampingMultiplier;
    } else {
      // Linear interpolation between min and max
      const heightRatio = (height - minHeight) / (maxHeight - minHeight);
      const dampingMultiplier = 1 + (heightRatio * (maxDampingMultiplier - 1));
      return baseDamping * dampingMultiplier;
    }
  };
  
  // Calculate dynamic damping value
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

// For creating static exports, get tokens at module load time
const staticTokens = tokens;

// Export pre-configured animations with current CSS variable values
export const accordionAnimationConfig = getAccordionTransitionConfig(staticTokens);
export const arrowAnimation = getArrowAnimationConfig(staticTokens);
export const contentAnimation = getContentAnimationConfig(staticTokens, 0);

// Helper function to get content animation with a specific height
export const getContentAnimationWithHeight = (height) => getContentAnimationConfig(staticTokens, height);
