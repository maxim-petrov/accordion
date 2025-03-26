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

  const defaultDuration = customTokens?.ACCORDION_TRANSITION_DURATION || tokens.ACCORDION_TRANSITION_DURATION;
  const [isOpen, setIsOpen] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);

  const [, startAnimation] = useAccordionAnimation(null, defaultDuration) || [null, () => {}];

  const numericMs = extractMs(defaultDuration) || 300;
  const durationSec = numericMs / 1000;

  const textHidingDurationMS = extractMs(customTokens?.ACCORDION_TEXT_TRANSITION_DURATION || tokens.ACCORDION_TEXT_TRANSITION_DURATION);
  const textHidingDurationSec = textHidingDurationMS / 1000 || 0.2;

  const textShowDurationMS = extractMs(customTokens?.ACCORDION_TEXT_SHOW_TRANSITION_DURATION || tokens.ACCORDION_TEXT_SHOW_TRANSITION_DURATION);
  const textShowDurationSec = textShowDurationMS / 1000 || 0.2;


  const contentShowDurationMS = extractMs(customTokens?.ACCORDION_CONTENT_SHOW_TRANSITION_DURATION || tokens.ACCORDION_CONTENT_SHOW_TRANSITION_DURATION);
  const contentShowDurationSec = contentShowDurationMS / 1000 || 0.2;

  const arrowPreset = customTokens?.ACCORDION_ARROW_PRESET || tokens.ACCORDION_ARROW_PRESET || 'stiff';
  const contentPreset = customTokens?.ACCORDION_CONTENT_PRESET || tokens.ACCORDION_CONTENT_PRESET || 'moderate';

  const arrowStiffness = parseFloat(
    customTokens?.ACCORDION_ARROW_STIFFNESS || tokens.ACCORDION_ARROW_STIFFNESS
  ) || 200;
  const arrowDamping = parseFloat(
    customTokens?.ACCORDION_ARROW_DAMPING || tokens.ACCORDION_ARROW_DAMPING
  ) || 20;
  const arrowMass = parseFloat(
    customTokens?.ACCORDION_ARROW_MASS || tokens.ACCORDION_ARROW_MASS
  ) || 1;

  const baseContentDamping = parseFloat(
    customTokens?.ACCORDION_CONTENT_DAMPING || tokens.ACCORDION_CONTENT_DAMPING
  ) || 15;
  const contentStiffness = parseFloat(
    customTokens?.ACCORDION_CONTENT_STIFFNESS || tokens.ACCORDION_CONTENT_STIFFNESS
  ) || 100;
  const contentMass = parseFloat(
    customTokens?.ACCORDION_CONTENT_MASS || tokens.ACCORDION_CONTENT_MASS
  ) || 1;

  useEffect(() => {
    if (!contentHeight && hiddenContentRef.current) {
      const height = hiddenContentRef.current.scrollHeight;
      if (height > 0) {
        setContentHeight(height);
      }
    }
  }, [contentHeight]);

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
          type: 'spring',
          duration: 20,
          stiffness: contentStiffness || 100,
          damping: contentDamping || 20,
          mass: contentMass || 1,
        },
        opacity: {
          duration: textShowDurationSec || 0.2,
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

  const dynamicContentAnimation = getContentAnimationWithHeight ? getContentAnimationWithHeight(contentHeight) : {};
  
  console.log('Dynamic content animation:', dynamicContentAnimation);

  const toggleAccordion = () => {
    if (isToggleDisabled) return;
    setIsToggleDisabled(true);

    if (!isOpen && contentHeight === 0 && hiddenContentRef.current) {
      const height = hiddenContentRef.current.scrollHeight;
      if (height > 0) {
        setContentHeight(height);
      }
    }

    setIsOpen((prev) => !prev);
    startAnimation();

    const lockDuration = numericMs > 0 ? numericMs : 300;
    setTimeout(() => setIsToggleDisabled(false), lockDuration);
  };

  return (
    <div className="_Gq5_ ql7Up" data-e2e-id="accordion-base">
      <div className="f_vB6">
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

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                className="acr-content-c3a-12-2-0"
                style={{ overflow: 'hidden' }}
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
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
