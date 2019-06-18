import React, { Component } from "react";
import PropTypes from "prop-types";
import { css } from "emotion";
import ThemeContext from "@hig/theme-context";
import { Search24, ClearSmall24 } from "@hig/icons";
import { memoizeCreateButtonEventHandlers } from "@hig/utils";
import stylesheet from "./stylesheet";

export default class Search extends Component {
  static propTypes = {
    /**
     * Called when search input loses focus.
     */
    onBlur: PropTypes.func,
    /**
     * Called when clicking icon to clear input.
     */
    onClearIconClick: PropTypes.func,
    /**
     * Called when search input gains focus.
     */
    onFocus: PropTypes.func,
    /**
     * Called when input changes.
     */
    onChange: PropTypes.func,
    /**
     * Placeholder text for the input field.
     */
    placeholder: PropTypes.string,
    /**
     * Value of the input field. Can be changed after mount to update the input value.
     */
    value: PropTypes.string
  };

  static defaultProps = {
    value: ""
  };

  state = {
    value: this.props.value
  };

  createEventHandlers = memoizeCreateButtonEventHandlers();

  handleChange = event => {
    this.setState(
      { value: event.target.value },
      () => this.props.onChange && this.props.onChange(event)
    );
  };

  handleClear = () =>
    this.setState(
      { value: "" },
      () => this.props.onClearIconClick && this.props.onClearIconClick()
    );

  render() {
    const { onBlur, onFocus, placeholder } = this.props;
    const { handleClick, handleKeyDown } = this.createEventHandlers(
      this.handleClear
    );

    return (
      <ThemeContext.Consumer>
        {({ resolvedRoles }) => {
          const styles = stylesheet(this.props, resolvedRoles);
          return (
            <div className={css(styles.search)}>
              <div className={css(styles.icon)}>
                <Search24 />
              </div>

              <div className={css(styles.inputWrapper)}>
                <input
                  className={css(styles.input)}
                  type="text"
                  onBlur={onBlur}
                  onFocus={onFocus}
                  onChange={this.handleChange}
                  placeholder={placeholder}
                  value={this.state.value}
                />
              </div>

              {this.state.value && this.state.value.length > 0 && (
                <div
                  className={css(styles.clear)}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                  role="button"
                  tabIndex={0}
                >
                  <ClearSmall24 />
                </div>
              )}
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
