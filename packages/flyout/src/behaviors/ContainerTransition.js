import React, { Component } from "react";
import PropTypes from "prop-types";
import Transition from "react-transition-group/Transition";

import { transitionStatuses } from "../transitionStatuses";

const TRANSITION_DURATION = 300;

export default class ContainerTransition extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    open: PropTypes.bool
  };

  static defaultProps = {
    open: false
  };

  state = {
    in: this.props.open,
    isVisible: this.props.open
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.show();
    } else if (prevProps.open && !this.props.open) {
      this.beginExit();
    }
  }

  /**
   * @param {string} transitionState
   * @returns {string}
   */
  getTransitionStatus(transitionState) {
    return !this.state.isVisible ? transitionStatuses.HIDDEN : transitionState;
  }

  handleExit = () => {
    this.hide();
  };

  beginExit() {
    window.requestAnimationFrame(() => {
      this.setState({ in: false });
    });
  }

  show() {
    window.requestAnimationFrame(() => {
      this.setState({ isVisible: true }, () => {
        window.requestAnimationFrame(() => {
          this.setState({ in: true });
        });
      });
    });
  }

  hide() {
    window.requestAnimationFrame(() => {
      this.setState({ isVisible: false });
    });
  }

  render() {
    return (
      <Transition
        in={this.state.in}
        onExited={this.handleExit}
        timeout={TRANSITION_DURATION}
      >
        {transitionState =>
          this.props.children(this.getTransitionStatus(transitionState))
        }
      </Transition>
    );
  }
}
