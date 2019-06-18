import React, { Component } from "react";
import PropTypes from "prop-types";
import { css } from "emotion";
import { ControlBehavior } from "@hig/behaviors";

import SliderPresenter from "./presenters/SliderPresenter";

/**
 * @typedef {string|number} Value
 */

/**
 * @typedef {Object} State
 * @property {Value} value
 */

export default class Slider extends Component {
  static propTypes = {
    /**
     * Initial value of the field. User action will override
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Prevents user actions on the field
     */
    disabled: PropTypes.bool,
    /**
     * HTML ID attribute
     */
    id: PropTypes.string,
    /**
     * Maximum value of the slider
     */
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Minimum value of the slider
     */
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Name of the field when submitted with a form
     */
    name: PropTypes.string,
    /**
     * Called when user moves focus from the field
     */
    onBlur: PropTypes.func,
    /**
     * Called after user changes the value of the field
     */
    onChange: PropTypes.func,
    /**
     * Called when user puts focus onto the field
     */
    onFocus: PropTypes.func,
    /**
     * Called as user changes the value of the field
     */
    onInput: PropTypes.func,
    /**
     * Called when user presses their mouse over the field
     */
    onMouseDown: PropTypes.func,
    /**
     * Called when user moves their mouse over the field
     */
    onMouseEnter: PropTypes.func,
    /**
     * Called when user moves their mouse out of the field
     */
    onMouseLeave: PropTypes.func,
    /**
     * Called when user releases their mouse press over the field
     */
    onMouseUp: PropTypes.func,
    /**
     * The granularity of each step on the slider
     */
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Value of the field
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    disabled: false,
    max: "100",
    min: "0",
    step: "1"
  };

  /**
   * @type {State}
   */
  state = {
    value: this.props.defaultValue || (this.props.max - this.props.min) / 2
  };

  /**
   * @returns {Value}
   */
  getValue() {
    if (this.isControlled()) {
      return this.props.value || 0;
    }

    return this.state.value;
  }

  /**
   * @param {Value} value
   */
  setValue(value) {
    const { onChange } = this.props;

    if (onChange) onChange(Number(value));

    if (!this.isControlled()) {
      this.setState({ value });
    }
  }

  /**
   * @param {event} Event
   */
  handleChange = event => {
    this.setValue(event.target.value);
  };

  isControlled() {
    return this.props.value !== undefined;
  }

  render() {
    const {
      defaultValue, // exclude from otherProps
      onBlur,
      onChange, // exclude from otherProps
      onFocus,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
      value, // exclude from otherProps
      ...otherProps
    } = this.props;

    const currentValue = this.getValue();

    return (
      <ControlBehavior
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      >
        {({
          hasFocus,
          hasHover,
          isPressed,
          onBlur: handleBlur,
          onFocus: handleFocus,
          onMouseDown: handleMouseDown,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          onMouseUp: handleMouseUp
        }) => (
          <div className={css({ display: "block" })}>
            <SliderPresenter
              hasFocus={hasFocus}
              hasHover={hasHover}
              isPressed={isPressed}
              onBlur={handleBlur}
              onChange={this.handleChange}
              onFocus={handleFocus}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              value={currentValue}
              {...otherProps}
            />
          </div>
        )}
      </ControlBehavior>
    );
  }
}
