import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useAccordionAnimation,
  accordionAnimationConfig,
  arrowAnimation,
  contentAnimation,
} from './scripts/animation.js';
import { extractMs } from './scripts/utils.js';
import '../index.css';
import './styles/component.scss';
import './styles/animation.scss';
import tokens from './tokens/utils/tokenUtils';
import { useTokens } from './context/TokenContext';

const Component = ({
  title = 'Заголовок',
  subtitle = 'Подзаголовок',
  content = 'Оригинал документа, на основании которого продавец стал собственником квартиры. Например, договор купли-продажи, договор долевого участия, договор дарения и другие (находится у собственника)',
}) => {
  const { tokenValues: customTokens } = useTokens();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, startAnimation, stopAnimation] = useAccordionAnimation(
    customTokens?.ACCORDION_ANIMATION_DURATION || null,
    customTokens?.ACCORDION_TRANSITION_DURATION || tokens.ACCORDION_TRANSITION_DURATION
  );
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);

  const getAnimationTokens = () => {
    if (customTokens) {
      return {
        duration: customTokens.duration,
        motion: customTokens.motion,
        stiffness: customTokens.ACCORDION_ARROW_STIFFNESS || tokens.ACCORDION_ARROW_STIFFNESS,
        damping: customTokens.ACCORDION_ARROW_DAMPING || tokens.ACCORDION_ARROW_DAMPING,
        mass: customTokens.ACCORDION_ARROW_MASS || tokens.ACCORDION_ARROW_MASS
      };
    } else {
      return {
        duration: tokens.ACCORDION_TRANSITION_DURATION,
        motion: tokens.ACCORDION_TRANSITION_EASING,
        stiffness: tokens.ACCORDION_ARROW_STIFFNESS,
        damping: tokens.ACCORDION_ARROW_DAMPING,
        mass: tokens.ACCORDION_ARROW_MASS
      };
    }
  };

  const getCustomArrowAnimation = () => {
    const animTokens = getAnimationTokens();
    
    return {
      transition: {
        duration: parseFloat(animTokens.duration) / 1000 || 0.15,
        ease: animTokens.motion,
        type: "spring",
        stiffness: animTokens.stiffness,
        damping: animTokens.damping,
        mass: animTokens.mass
      }
    };
  };

  const getCustomContentAnimation = () => {
    const animTokens = getAnimationTokens();
    
    return {
      initial: { height: 0, opacity: 0 },
      animate: { height: "auto", opacity: 1 },
      exit: { height: 0, opacity: 0 },
      transition: {
        height: {
          duration: parseFloat(animTokens.duration) / 1000 || 0.25,
          ease: "easeInOut",
          type: "tween"
        },
        opacity: {
          duration: parseFloat(tokens.ACCORDION_CONTENT_OPACITY_DURATION) / 1000 || 0.15,
          ease: tokens.ACCORDION_CONTENT_OPACITY_EASING
        }
      },
      style: { overflow: "hidden" }
    };
  };

  const toggleAccordion = () => {
    if (isToggleDisabled) return;
    
    setIsToggleDisabled(true);
    setIsOpen(!isOpen);
    startAnimation();
    
    const animDuration = extractMs(customTokens?.ACCORDION_TRANSITION_DURATION || 
                                  tokens.ACCORDION_TRANSITION_DURATION);
    
    const disableTime = animDuration + 100;
    
    setTimeout(() => {
      setIsToggleDisabled(false);
    }, disableTime);
  };

  return (
    <div className="_Gq5_ ql7Up" data-e2e-id="accordion-base">
      <div className="f_vB6">
        <div 
          className="acr-root-bdf-12-2-0 acr-divider-502-12-2-0" 
          data-e2e-id="accordion-default" 
          tabIndex="0"
          role="presentation"
        >
          <div 
            onClick={toggleAccordion}
            data-e2e-id="accordion-default--toggle-button" 
            className="acr-wrapTop-79f-12-2-0" 
            tabIndex="-1"
            style={{ cursor: 'pointer' }}
          >
            <div className="acr-defaultTitle-147-12-2-0">
              <div className="acr-wrapTitles-556-12-2-0">
                <div className="acr-header-e6e-12-2-0">
                  <div>
                    <div className="acr-wrapTitle-d35-12-2-0">
                      <h2 className="tg-heading-small-dc0-7-0-3">
                        <div className="acr-title-c71-12-2-0">{title}</div>
                      </h2>
                    </div>
                    <h5 className="acr-subtitle-d8b-12-2-0">{subtitle}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="acr-arrow-60f-12-2-0">
              <div className="icon-root-864-6-0-3 acr-icon-ea7-12-2-0">
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  fill="none"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={customTokens ? getCustomArrowAnimation().transition : arrowAnimation.transition}
                  style={{ transformOrigin: 'center' }}
                >
                  <path 
                    fill="currentColor" 
                    fillRule="evenodd"
                    d="M7.41 11.09a.833.833 0 0 0 1.18 0l5-5a.833.833 0 0 0-1.18-1.18L8 9.322l-4.41-4.41A.833.833 0 0 0 2.41 6.09l5 5Z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {isOpen && (
              <motion.div 
                key="content"
                layout="position"
                className="acr-content-c3a-12-2-0"
                initial={contentAnimation.initial}
                animate={contentAnimation.animate}
                exit={contentAnimation.exit}
                transition={customTokens ? getCustomContentAnimation().transition : contentAnimation.transition}
                style={contentAnimation.style}
              >
                <div 
                  className="tg-body-standard-regular-bdb-7-0-3"
                  style={{ padding: "0 24px 24px" }}
                >{content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Component;
