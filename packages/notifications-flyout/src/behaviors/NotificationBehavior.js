import React, { Component } from "react";
import Transition from "react-transition-group/Transition";
import PropTypes from "prop-types";

const TRANSITION_DURATION = 300;

/**
 * @typedef {Object} Payload
 * @property {string} transitionStatus
 * @property {function(MouseEvent): void} handleDismissButtonClick
 */

export default class NotificationBehavior extends Component {
  static propTypes = {
    /** Notification content */
    children: PropTypes.func.isRequired,
    /** A callback called when user dismisses a featured notification */
    onDismiss: PropTypes.func
  };

  /**
   * @type {Object}
   * @property {string} height Inline style height of the Notification wrapper
   * @property {boolean} isVisible Determines whether the state of the visibility transition
   */
  state = {
    height: "",
    isVisible: true
  };

  /**
   * @param {HTMLDivElement} containerRef
   */
  refContainer = containerRef => {
    this.containerRef = containerRef;
  };

  handleExit = () => {
    const { onDismiss } = this.props;

    if (onDismiss) onDismiss();
  };

  handleDismissButtonClick = () => {
    this.hide();
  };

  /** @type {HTMLDivElement} */
  containerRef;

  /**
   * Sets the current height of the notification
   * so that the height transition can occur
   */
  prepareHideTransition() {
    return new Promise(resolve => {
      this.setState({ height: `${this.containerRef.clientHeight}px` }, () => {
        window.requestAnimationFrame(resolve);
      });
    });
  }

  /**
   * Begins the hide transition by setting the `isVisible` prop
   * The height is then controlled via CSS in the `NotificationPresenter`
   *
   * This method calls `requestAnimationFrame` again to ensure that a repaint occurs.
   * @see https://stackoverflow.com/a/42302185
   */
  startHideTransition() {
    window.requestAnimationFrame(() => {
      this.setState({
        height: "",
        isVisible: false
      });
    });
  }

  hide() {
    this.prepareHideTransition().then(() => this.startHideTransition());
  }

  render() {
    const { refContainer: innerRef, handleDismissButtonClick } = this;
    const { children } = this.props;
    const { height, isVisible } = this.state;

    return (
      <Transition
        in={isVisible}
        onExited={this.handleExit}
        timeout={TRANSITION_DURATION}
      >
        {transitionStatus =>
          children({
            handleDismissButtonClick,
            height,
            innerRef,
            transitionStatus
          })
        }
      </Transition>
    );
  }
}
