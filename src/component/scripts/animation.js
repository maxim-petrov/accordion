import { useEffect, useState } from 'react';
import tokens from '../tokens/utils/tokenUtils.js';
import { extractMs } from './utils.js';

export const useSliderAnimation = (customDuration = null, customTransitionDuration = null) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      let animationDuration;
      
      if (customTransitionDuration) {
        animationDuration = extractMs(customTransitionDuration);
      } else if (customDuration) {
        animationDuration = extractMs(customDuration);
      } else {
        animationDuration = extractMs(tokens.SLIDER_TRANSITION_DURATION) ||
                          parseInt(tokens.SLIDER_ANIMATION_DURATION);
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


export const getSliderTransitionStyle = (isDragging, isAnimating) => {
  if (isDragging && !isAnimating) {
    return 'none';
  }
  return isAnimating
    ? `left ${tokens.SLIDER_TRANSITION_DURATION} ${tokens.SLIDER_TRANSITION_EASING}, right ${tokens.SLIDER_TRANSITION_DURATION} ${tokens.SLIDER_TRANSITION_EASING}`
    : 'none';
};


export const getInputDraggingStyle = (isDragging) => {
  if (isDragging) {
    return { pointerEvents: 'none' };
  }
  return {};
};

export const SLIDER_ANIMATION = {
  DURATION_MS: parseInt(tokens.SLIDER_ANIMATION_DURATION),
  TRANSITION_DURATION: tokens.SLIDER_TRANSITION_DURATION,
  EASING: tokens.SLIDER_TRANSITION_EASING,
};
