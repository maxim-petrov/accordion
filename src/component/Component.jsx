import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccordionAnimation } from './scripts/animation.js';
import { extractMs } from './scripts/utils.js';
import tokens from './tokens/utils/tokenUtils';
import { useTokens } from './context/TokenContext';
import '../index.css';
import './styles/component.scss';
import './styles/animation.scss';

const Component = ({
  title = 'Заголовок',
  subtitle = 'Подзаголовок',
  content = 'Оригинал документа, на основании которого продавец стал собственником квартиры. Например, договор купли-продажи, договор долевого участия, договор дарения и другие (находится у собственника)',
}) => {
  const { tokenValues: customTokens } = useTokens();

  // Duration from tokens or fallback
  const defaultDuration = customTokens?.ACCORDION_TRANSITION_DURATION || tokens.ACCORDION_TRANSITION_DURATION;
  const [isOpen, setIsOpen] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);

  // If you have your own "useAccordionAnimation", that's fine:
  const [, startAnimation] = useAccordionAnimation(null, defaultDuration);

  // Convert durations from ms → s for Framer Motion
  const numericMs = extractMs(defaultDuration);
  const durationSec = numericMs / 1000;

  // Anim tokens
  const stiffness = parseFloat(
    customTokens?.ACCORDION_ARROW_STIFFNESS || tokens.ACCORDION_ARROW_STIFFNESS
  );
  const damping = parseFloat(
    customTokens?.ACCORDION_ARROW_DAMPING || tokens.ACCORDION_ARROW_DAMPING
  );
  const mass = parseFloat(
    customTokens?.ACCORDION_ARROW_MASS || tokens.ACCORDION_ARROW_MASS
  );

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
          duration: 0.15,
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
          stiffness,
          damping,
          mass,
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
    stiffness,
    damping,
    mass,
  };

  // Toggle function
  const toggleAccordion = () => {
    if (isToggleDisabled) return;
    setIsToggleDisabled(true);

    setIsOpen((prev) => !prev);
    startAnimation();

    // Lock the toggle just for the base animation duration
    setTimeout(() => setIsToggleDisabled(false), numericMs);
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
                <div style={{ padding: '0 24px 24px' }}>
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
