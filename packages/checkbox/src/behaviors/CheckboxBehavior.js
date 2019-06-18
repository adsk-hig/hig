import { Component } from "react";
import PropTypes from "prop-types";

/**
 * @typedef {Object} State
 * @property {boolean} checked
 */

export default class CheckboxBehavior extends Component {
  static propTypes = {
    /**
     * Checks the checkbox
     */
    checked: PropTypes.bool,
    /**
     * Initially checks the checkbox, but allows user action to change it
     */
    defaultChecked: PropTypes.bool,
    /**
     * Called when user clicks on the field
     */
    onClick: PropTypes.func,
    /**
     * Called when user changes the value of the field
     */
    onChange: PropTypes.func,
    /**
     * Render prop
     */
    children: PropTypes.func
  };

  static defaultProps = {
    defaultChecked: false
  };

  /**
   * @type {State}
   */
  state = {
    checked: this.props.defaultChecked
  };

  /**
   * @returns {boolean}
   */
  getChecked() {
    if (this.isControlled()) {
      return this.props.checked;
    }

    return this.state.checked;
  }

  /**
   * @param {boolean} checked
   */
  setChecked(checked) {
    const { onChange } = this.props;

    if (onChange) onChange(checked);

    if (!this.isControlled()) {
      this.setState({ checked });
    }
  }

  /**
   * @param {UIEvent} event
   */
  handleChange = event => {
    this.setChecked(event.target.checked);
  };

  isControlled() {
    return this.props.checked !== undefined;
  }

  render() {
    const { handleChange } = this;
    const { onClick: handleClick } = this.props;
    const checked = this.getChecked();

    return this.props.children({
      checked,
      handleChange,
      handleClick
    });
  }
}
