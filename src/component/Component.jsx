import React, { useState, useEffect, useRef } from 'react';
import {
  useSliderAnimation,
  getInputDraggingStyle,
} from './scripts/animation.js';
import '../index.css';
import './styles/component.scss';
import './styles/animation.scss';
import tokens from './tokens/utils/tokenUtils';
import { useTokens } from './context/TokenContext';



const Component = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 0,
  label = 'Значение',
  steps = [0, 25, 50, 75, 100],
  withInput = true,
  active = false,
  onChange,
}) => {
  const { tokenValues: customTokens } = useTokens();
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, startAnimation, stopAnimation] = useSliderAnimation(
    customTokens?.SLIDER_ANIMATION_DURATION || null,
    customTokens?.SLIDER_TRANSITION_DURATION || tokens.SLIDER_TRANSITION_DURATION
  );
  const [isFocused, setIsFocused] = useState(false);
  const sliderRef = useRef(null);
  const inputRef = useRef(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const getAnimationTokens = () => {
    if (customTokens) {
      return {
        duration: customTokens.duration,
        motion: customTokens.motion
      };
    } else {
      return {
        duration: tokens.SLIDER_TRANSITION_DURATION,
        motion: tokens.SLIDER_TRANSITION_EASING
      };
    }
  };

  const getCustomSliderTransitionStyle = (isDragging, isAnimating) => {
    if (isDragging && !isAnimating) {
      return 'none';
    }
    
    if (customTokens && isAnimating) {
      const longestDuration = customTokens.SLIDER_TRANSITION_DURATION || customTokens.duration;
      const motionType = customTokens.SLIDER_TRANSITION_EASING || customTokens.motion;
      
      return `left ${longestDuration} ${motionType}, right ${longestDuration} ${motionType}`;
    }
    
    return isAnimating
      ? `left ${tokens.SLIDER_TRANSITION_DURATION} ${tokens.SLIDER_TRANSITION_EASING}, 
         right ${tokens.SLIDER_TRANSITION_DURATION} ${tokens.SLIDER_TRANSITION_EASING}`
      : 'none';
  };

  const handleInputChange = (e) => {
    const newValue = Math.min(
      Math.max(parseInt(e.target.value) || min, min),
      max
    );
    setValue(newValue);
    startAnimation();
    if (onChange) onChange(newValue);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = Math.min(value + step, max);
      setValue(newValue);
      stopAnimation();
      if (onChange) onChange(newValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(value - step, min);
      setValue(newValue);
      stopAnimation();
      if (onChange) onChange(newValue);
    }
  };

  const handleInputContainerClick = (e) => {
    focusInput();
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const offset = Math.min(
      Math.max(0, e.clientX - sliderRect.left),
      sliderWidth
    );

    let newPercentage = Math.max(
      0,
      Math.min(100, (offset / sliderWidth) * 100)
    );
    let newValue =
      min + Math.round(((newPercentage / 100) * (max - min)) / step) * step;

    stopAnimation();
    setValue(newValue);

    e.preventDefault();
  };

  const handleDragStart = (e) => {
    console.log('Drag start');
    setIsDragging(true);
    stopAnimation();

    e.preventDefault();
    e.stopPropagation();
    document.body.style.userSelect = 'none';
  };

  const handleDragEnd = () => {
    console.log('Drag end');
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  const handleAxisClick = (e) => {
    if (!sliderRef.current || isDragging) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const offset = e.clientX - sliderRect.left;

    let newPercentage = Math.max(
      0,
      Math.min(100, (offset / sliderWidth) * 100)
    );
    let newValue =
      min + Math.round(((newPercentage / 100) * (max - min)) / step) * step;

    setValue(newValue);

    setIsDragging(true);

    startAnimation();

    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('mousemove', handleMouseMove);

    if (onChange) onChange(newValue);

    e.preventDefault();
    e.stopPropagation();
    document.body.style.userSelect = 'none';
  };

  const handleStepClick = (stepValue) => (e) => {
    if (isDragging) return;

    setValue(stepValue);

    setIsDragging(true);

    startAnimation();

    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('mousemove', handleMouseMove);

    if (onChange) onChange(stepValue);

    e.preventDefault();
    e.stopPropagation();
    document.body.style.userSelect = 'none';
  };

  const handleHintsContainerClick = (e) => {
    if (isDragging) return;

    if (
      e.target.className.includes('component-valueHint-1ed-11-0-8') ||
      e.target.className.includes('component-hintText-eb7-11-0-8')
    ) {
      return;
    }

    const containerRect = e.currentTarget.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const offset = e.clientX - containerRect.left;

    let newPercentage = Math.max(
      0,
      Math.min(100, (offset / containerWidth) * 100)
    );
    let newValue =
      min + Math.round(((newPercentage / 100) * (max - min)) / step) * step;

    setValue(newValue);

    setIsDragging(true);

    startAnimation();

    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('mousemove', handleMouseMove);

    if (onChange) onChange(newValue);

    e.preventDefault();
    e.stopPropagation();
    document.body.style.userSelect = 'none';
  };

  const renderWithInput = () => (
    <div className="_Gq5_ ql7Up" data-e2e-id="slider-default">
      <div style={{ width: '282px' }}>
        <div
          className={`slider-inputRoot-bee-11-0-8 ${
            isDragging ? 'component-dragging-input' : ''
          }`}
          data-e2e-id="slider"
        >
          <div
            className="inpt-fluid-199-12-3-0"
            style={getInputDraggingStyle(isDragging)}
          >
            <div
              className={`inpt-root-670-12-3-0 inpt-large-258-12-3-0 inpt-primary-8dd-12-3-0 inpt-notEmpty-432-12-3-0 inpt-fluid-199-12-3-0 inpt-hasLabel-14b-12-3-0 nmbr-inp-root-220-11-1-0 ${
                isFocused ? 'inpt-focused-b65-12-3-0' : ''
              }`}
              data-e2e-id="slider-input"
              onClick={handleInputContainerClick}
              style={getInputDraggingStyle(isDragging)}
            >
              <div className="inpt-inputContainer-d7e-12-3-0">
                <input
                  ref={inputRef}
                  className="inpt-input-3c4-12-3-0"
                  step={step}
                  tabIndex="0"
                  value={value}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                />
                <label className="inpt-label-a7f-12-3-0 inpt-labelWithoutLabelId-299-12-3-0">
                  {label}
                </label>
              </div>
            </div>
          </div>

          <span
            className={`slider-root-80f-11-0-8 slider-inputSliderMode-be3-11-0-8 ${
              isDragging ? 'slider-dragging' : ''
            }`}
            data-e2e-id="slider-slider"
          >
            <span
              className="slider-axisContainer-04b-11-0-8"
              ref={sliderRef}
              onMouseDown={handleAxisClick}
            >
              <span className="slider-axis-923-11-0-8">
                <span
                  className="slider-axisFill-f1d-11-0-8"
                  style={{
                    right: `${100 - percentage}%`,
                    transition: getCustomSliderTransitionStyle(
                      isDragging,
                      isAnimating
                    ),
                  }}
                />
              </span>

              <span
                className={`slider-thumb-2b5-11-0-8 ${
                  isDragging ? 'slider-dragging' : ''
                }`}
                data-e2e-id="slider-slider-thumb"
                style={{
                  left: `${percentage}%`,
                  transition: getCustomSliderTransitionStyle(isDragging, isAnimating),
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={handleDragStart}
                tabIndex="0"
              >
                <span className="slider-thumbInner-c38-11-0-8">
                  <span className="slider-thumbInnerDot"></span>
                </span>
              </span>
            </span>

            <span
              className="slider-valueHints-c0e-11-0-8"
              onMouseDown={handleHintsContainerClick}
              style={{ cursor: 'pointer' }}
            >
              {steps.map((step, index) => (
                <span
                  key={index}
                  className="slider-valueHint-1ed-11-0-8"
                  onMouseDown={handleStepClick(step)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="slider-hintText-eb7-11-0-8">{step}</span>
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>
    </div>
  );

  const renderWithoutInput = () => (
    <div className="_Gq5_ ql7Up" data-e2e-id="slider-default">
      <div style={{ width: '282px' }}>
        <span
          className={`slider-root-80f-11-0-8 ${
            active ? 'slider-active-c30-11-0-8' : ''
          } ${isDragging ? 'slider-dragging' : ''}`}
          data-e2e-id="slider"
          tabIndex="0"
        >
          <span
            className="slider-axisContainer-04b-11-0-8"
            ref={sliderRef}
            onMouseDown={handleAxisClick}
          >
            <span className="slider-axis-923-11-0-8">
              <span
                className="slider-axisFill-f1d-11-0-8"
                style={{
                  right: `${100 - percentage}%`,
                  transition: getCustomSliderTransitionStyle(isDragging, isAnimating),
                }}
              />
            </span>

            <span
              className={`slider-thumb-2b5-11-0-8 ${
                isDragging ? 'slider-dragging' : ''
              }`}
              data-e2e-id="slider-thumb"
              style={{
                left: `${percentage}%`,
                transition: getCustomSliderTransitionStyle(isDragging, isAnimating),
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              onMouseDown={handleDragStart}
              tabIndex="0"
            >
              <span className="slider-thumbInner-c38-11-0-8">
                <span className="slider-thumbInnerDot"></span>
              </span>
            </span>
          </span>

          <span
            className="slider-valueHints-c0e-11-0-8"
            onMouseDown={handleHintsContainerClick}
            style={{ cursor: 'pointer' }}
          >
            {steps.map((step, index) => (
              <span
                key={index}
                className="slider-valueHint-1ed-11-0-8"
                onMouseDown={handleStepClick(step)}
                style={{ cursor: 'pointer' }}
              >
                <span className="slider-hintText-eb7-11-0-8">{step}</span>
              </span>
            ))}
          </span>
        </span>
      </div>
    </div>
  );

  return withInput ? renderWithInput() : renderWithoutInput();
};

export default Component;
