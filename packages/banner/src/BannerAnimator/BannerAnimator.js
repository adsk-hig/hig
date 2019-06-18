import React, { Component } from "react";
import PropTypes from "prop-types";
import { polyfill } from "react-lifecycles-compat";

import { positions, AVAILABLE_POSITIONS } from "./positions";
import statuses from "./statuses";

import {
  animateCollapse,
  animateExpand,
  endCollapse,
  endExpand,
  prepareCollapse,
  startCollapse,
  startExpand
} from "./updaters";

/**
 * @typedef {Object} BannerAnimatorProps
 * @property {boolean} [isVisible]
 * @property {boolean} [hasBounce]
 * @property {boolean} [hasPush]
 * @property {string} [position]
 * @property {function(ContainerBag): JSX.Element} children
 */

/**
 * @typedef {Object} BannerAnimatorState
 * @property {string} [status]
 * @property {Object.<string, string>} [wrapperStyle]
 * @property {Object.<string, string>} [innerWrapperStyle]
 * @property {HTMLDivElement} [wrapper]
 * @property {HTMLDivElement} [innerWrapper]
 */

/** @type {Component<BannerAnimatorProps, BannerAnimatorState>} */
class BannerAnimator extends Component {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    /** Determines the visibility of the banner */
    isVisible: PropTypes.bool,
    /** Determines the type of animation used */
    hasBounce: PropTypes.bool,
    /** Determines the type of animation used */
    hasPush: PropTypes.bool,
    /** Determines the direction of the animation */
    position: PropTypes.oneOf(AVAILABLE_POSITIONS),
    /* eslint-enable react/no-unused-prop-types */
    /** A render prop, that renders the component to be animated */
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    isVisible: true,
    hasBounce: true,
    hasPush: true,
    position: positions.TOP
  };

  /** @type {BannerAnimatorState} */
  state = {};

  /**
   * @param {BannerAnimatorProps} nextProps
   * @param {BannerAnimatorState} prevState
   * @returns {BannerAnimatorState | null}
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const { isVisible } = nextProps;
    const { status } = prevState;

    if (!status) {
      return isVisible ? endExpand() : endCollapse();
    }

    switch (status) {
      case statuses.COLLAPSED:
      case statuses.COLLAPSING:
        return isVisible ? startExpand() : null;
      case statuses.EXPANDED:
      case statuses.EXPANDING:
        return isVisible ? null : startCollapse();
      default:
        // eslint-disable-next-line no-console
        console.warn("Invalid status", { status });
        return null;
    }
  }

  /**
   * @param {BannerAnimatorProps} prevProps
   * @param {BannerAnimatorState} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    const { status: prevStatus } = prevState;
    const { status } = this.state;

    if (prevStatus === statuses.EXPANDED && status === statuses.COLLAPSING) {
      this.collapseFromExpanded();
      return;
    }
    if (prevStatus === statuses.COLLAPSING && status === statuses.EXPANDING) {
      this.expand();
      return;
    }
    if (prevStatus === statuses.EXPANDING && status === statuses.COLLAPSING) {
      this.collapse();
    }
  }

  handleReady = () => {
    const { status } = this.state;

    if (status === statuses.EXPANDING) {
      this.expand();
    }
  };

  /** @param {TransitionEvent} event */
  handleTransitionEnd = event => {
    const { innerWrapper } = this.state;

    if (event.target !== innerWrapper) return;

    const { status } = this.state;

    if (status === statuses.COLLAPSING) {
      window.requestAnimationFrame(() => {
        this.setState(endCollapse);
      });
      return;
    }

    if (status === statuses.EXPANDING) {
      window.requestAnimationFrame(() => {
        this.setState(endExpand);
      });
    }
  };

  /** @param {HTMLDivElement} innerWrapper */
  refInnerWrapper = innerWrapper => {
    this.setState({ innerWrapper });
  };

  /** @type {BannerAnimatorProps} */
  props;

  expand() {
    window.requestAnimationFrame(() => {
      this.setState(animateExpand);
    });
  }

  collapse() {
    window.requestAnimationFrame(() => {
      this.setState(animateCollapse);
    });
  }

  collapseFromExpanded() {
    window.requestAnimationFrame(() => {
      this.setState(prepareCollapse, () => {
        this.collapse();
      });
    });
  }

  render() {
    const { children: renderChildren } = this.props;
    const { status, wrapperStyle, innerWrapperStyle } = this.state;
    const { handleReady, handleTransitionEnd, refInnerWrapper } = this;
    const children =
      status === statuses.COLLAPSED ? null : renderChildren({ handleReady });
    const isBusy =
      status === statuses.EXPANDING || status === statuses.COLLAPSING;

    return (
      <div
        aria-busy={isBusy}
        aria-expanded={status === statuses.EXPANDED}
        style={wrapperStyle}
        onTransitionEnd={handleTransitionEnd}
      >
        <div style={innerWrapperStyle} ref={refInnerWrapper}>
          {children}
        </div>
      </div>
    );
  }
}

export default polyfill(BannerAnimator);
