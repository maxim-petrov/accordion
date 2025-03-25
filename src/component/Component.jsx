import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccordionAnimation, getContentAnimationWithHeight } from './scripts/animation.js';
import { extractMs } from './scripts/utils.js';
import tokens from './tokens/utils/tokenUtils';
import { useTokens } from './context/TokenContext';
import '../index.css';
import './styles/component.scss';
import './styles/animation.scss';

const Component = ({
  title = 'Правоустанавливающий документ',
  subtitle = 'Подтверждение права собственности',
  content = <p>Документ, подтверждающий право собственности на квартиру.</p>,
}) => {
  const { tokenValues: customTokens } = useTokens();
  const contentRef = useRef(null);
  const hiddenContentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Duration from tokens or fallback
  const defaultDuration = customTokens?.ACCORDION_TRANSITION_DURATION || tokens.ACCORDION_TRANSITION_DURATION;
  const [isOpen, setIsOpen] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);

  // If you have your own "useAccordionAnimation", that's fine:
  const [, startAnimation] = useAccordionAnimation(null, defaultDuration) || [null, () => {}];

  // Convert durations from ms → s for Framer Motion
  const numericMs = extractMs(defaultDuration) || 300; // Default to 300ms if extraction fails
  const durationSec = numericMs / 1000;

  const textHidingDurationMS = extractMs(customTokens?.ACCORDION_TEXT_TRANSITION_DURATION || tokens.ACCORDION_TEXT_TRANSITION_DURATION);
  const textHidingDurationSec = textHidingDurationMS / 1000 || 0.2; // Add fallback value

  // Animation presets
  const arrowPreset = customTokens?.ACCORDION_ARROW_PRESET || tokens.ACCORDION_ARROW_PRESET || 'stiff';
  const contentPreset = customTokens?.ACCORDION_CONTENT_PRESET || tokens.ACCORDION_CONTENT_PRESET || 'moderate';

  // Arrow animation tokens
  const arrowStiffness = parseFloat(
    customTokens?.ACCORDION_ARROW_STIFFNESS || tokens.ACCORDION_ARROW_STIFFNESS
  ) || 200;
  const arrowDamping = parseFloat(
    customTokens?.ACCORDION_ARROW_DAMPING || tokens.ACCORDION_ARROW_DAMPING
  ) || 20;
  const arrowMass = parseFloat(
    customTokens?.ACCORDION_ARROW_MASS || tokens.ACCORDION_ARROW_MASS
  ) || 1;

  // Content animation tokens - base values
  const baseContentDamping = parseFloat(
    customTokens?.ACCORDION_CONTENT_DAMPING || tokens.ACCORDION_CONTENT_DAMPING
  ) || 15;
  const contentStiffness = parseFloat(
    customTokens?.ACCORDION_CONTENT_STIFFNESS || tokens.ACCORDION_CONTENT_STIFFNESS
  ) || 100;
  const contentMass = parseFloat(
    customTokens?.ACCORDION_CONTENT_MASS || tokens.ACCORDION_CONTENT_MASS
  ) || 1;

  // Create hidden content for measurement on first render
  useEffect(() => {
    if (!contentHeight && hiddenContentRef.current) {
      const height = hiddenContentRef.current.scrollHeight;
      if (height > 0) {
        setContentHeight(height);
      }
    }
  }, [contentHeight]);

  // Update height measurement when accordion is opened
  useEffect(() => {
    if (isOpen && contentRef.current) {
      requestAnimationFrame(() => {
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
      });
    }
  }, [isOpen, content]);

  const calculateDynamicDamping = (height) => {
    const minDamping = baseContentDamping;
    
    const minHeight = 100;
    const maxHeight = 800;
    
    const maxDampingMultiplier = 1.25;
    
    if (height <= minHeight) {
      return minDamping;
    } else if (height >= maxHeight) {
      return minDamping * maxDampingMultiplier;
    } else {
      const heightRatio = (height - minHeight) / (maxHeight - minHeight);
      const dampingMultiplier = 1 + (heightRatio * (maxDampingMultiplier - 1));
      return minDamping * dampingMultiplier;
    }
  };

  const contentDamping = calculateDynamicDamping(contentHeight);

  console.log('Arrow animation:', { 
    preset: arrowPreset,
    values: { stiffness: arrowStiffness, damping: arrowDamping, mass: arrowMass }
  });
  console.log('Content animation:', { 
    preset: contentPreset,
    values: { 
      stiffness: contentStiffness, 
      damping: contentDamping, 
      mass: contentMass,
      contentHeight 
    }
  });

  // --- Variants approach ---
  // The big trick is "open" vs. "closed" states, each with its own transitions.
  const contentVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          type: 'tween',
          duration: durationSec || 0.25,
          ease: 'easeInOut',
        },
        opacity: {
          duration: textHidingDurationSec || 0.2,
          ease: 'easeInOut',
        },
      },
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: {
          // Spring on open
          type: 'spring',
          stiffness: contentStiffness || 100,
          damping: contentDamping || 20,
          mass: contentMass || 1,
        },
        opacity: {
          duration: 0.15,
          ease: 'easeOut',
        },
      },
    },
  };

  const arrowVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };
  const arrowTransition = {
    type: 'spring',
    stiffness: arrowStiffness,
    damping: arrowDamping,
    mass: arrowMass,
  };

  // If we're using our own animation config utility, get the animation configuration
  // This is an alternative way to get the same values as above
  const dynamicContentAnimation = getContentAnimationWithHeight ? getContentAnimationWithHeight(contentHeight) : {};
  
  console.log('Dynamic content animation:', dynamicContentAnimation);

  // Toggle function
  const toggleAccordion = () => {
    if (isToggleDisabled) return;
    setIsToggleDisabled(true);

    // If we haven't measured the content height yet, and we're opening
    if (!isOpen && contentHeight === 0 && hiddenContentRef.current) {
      const height = hiddenContentRef.current.scrollHeight;
      if (height > 0) {
        setContentHeight(height);
      }
    }

    setIsOpen((prev) => !prev);
    startAnimation();

    // Lock the toggle for the animation duration (ensure it's a valid number)
    const lockDuration = numericMs > 0 ? numericMs : 300; // Fallback to 300ms if value is invalid
    setTimeout(() => setIsToggleDisabled(false), lockDuration);
  };

  return (
    <div className="_Gq5_ ql7Up" data-e2e-id="accordion-base">
      <div className="f_vB6">
        {/* Hidden content for measurement on first render */}
        <div 
          ref={hiddenContentRef} 
          style={{ 
            position: 'absolute', 
            visibility: 'hidden', 
            height: 'auto',
            width: '100%',
            overflow: 'hidden',
            padding: '0 24px 24px',
            pointerEvents: 'none',
            zIndex: -1
          }}
        >
          {content}
        </div>

        <div
          className="acr-root-bdf-12-2-0 acr-divider-502-12-2-0"
          data-e2e-id="accordion-default"
          tabIndex="0"
          role="presentation"
        >
          {/* HEADER / TOGGLE BUTTON */}
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
            {/* Arrow */}
            <div className="acr-arrow-60f-12-2-0">
              <div className="icon-root-864-6-0-3 acr-icon-ea7-12-2-0">
                <motion.svg
                  width="16"
                  height="16"
                  fill="none"
                  style={{ transformOrigin: 'center' }}
                  variants={arrowVariants}
                  animate={isOpen ? 'open' : 'closed'}
                  transition={arrowTransition}
                  xmlns="http://www.w3.org/2000/svg"
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

          {/* AnimatePresence for unmounting on close. */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                // Instead of key="content", let AnimatePresence handle it
                className="acr-content-c3a-12-2-0"
                style={{ overflow: 'hidden' }}
                // We use variants instead of manual initial/animate/exit
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {/* Put padding on an inner wrapper so "height" anim is clean */}
                <div style={{ padding: '0 24px 24px' }} ref={contentRef}>
                  {content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Component;
