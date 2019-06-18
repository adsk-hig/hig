import React, { Component } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";

const MAX_INCREASE_PER_MS = 1 / 1000;

export default class ProgressRingDeterminateBehavior extends Component {
  static propTypes = {
    /**
     * An integer from 0 to 100 representing the percent the delayed operation has completed
     */
    percentComplete: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Render prop */
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.value = 0;
    this.prevTimestamp = 0;
  }

  state = {
    cssTransitionState: null,
    transitionEnter: true
  };

  componentDidUpdate() {
    if (
      this.state.cssTransitionState === "entered" ||
      this.state.cssTransitionState === "exited"
    ) {
      this.initSegments();
      this.setProgress(this.props.percentComplete);
    }
  }

  setProgress(percent) {
    this.targetValue = percent / 100;

    if (!this.prevTimestamp) {
      this.prevTimestamp = window.performance.now();
    }
    window.requestAnimationFrame(this.step);
  }

  setSegmentOpacities(value) {
    this.segments.forEach((segment, i) => {
      const index = Math.abs(i - this.SEGMENT_COUNT) - 1;
      const eachSegment = segment;
      eachSegment.style.opacity = this.opacityForSegment(index, value);
    });
  }

  step = timestamp => {
    if (
      this.state.cssTransitionState === "entering" ||
      this.state.cssTransitionState === "exiting"
    ) {
      this.wait();
      return;
    }

    if (
      this.state.cssTransitionState === "exited" &&
      this.value !== this.targetValue
    ) {
      this.enter();
      return;
    }

    if (
      this.targetValue === 1 &&
      this.value === 1 &&
      this.state.cssTransitionState !== "exited"
    ) {
      this.exit();
      return;
    }

    this.progressTowardTarget(timestamp);
  };

  handleEntering = () => {
    this.setState({ cssTransitionState: "entering" });
  };

  handleEntered = () => {
    this.setState({ cssTransitionState: "entered" });
    this.setProgress(this.props.percentComplete);
  };

  handleExiting = () => {
    this.setState({ cssTransitionState: "exiting" });
  };

  handleExited = () => {
    this.setState({ cssTransitionState: "exited" });
  };

  /**
   * @param {HTMLDivElement} containerRef
   */
  refContainer = containerRef => {
    this.containerRef = containerRef;
  };

  /** @type {HTMLDivElement} */
  containerRef;

  enter() {
    this.segments.forEach(segment => {
      const eachSegment = segment;
      eachSegment.style.opacity = 0;
    });
    this.setState({ transitionEnter: true });
    this.wait();
  }

  exit() {
    this.segments.forEach(segment => {
      const eachSegment = segment;
      eachSegment.style.opacity = null;
    });
    this.setState({ transitionEnter: false });
    this.wait();
  }

  wait() {
    this.prevTimestamp = window.performance.now();
    window.requestAnimationFrame(this.step);
  }

  initSegments() {
    this.segments = Array.from(
      this.containerRef.querySelectorAll(".hig__progress-ring__segment")
    );
    this.containerRef.querySelector(
      ".hig__progress-ring__mask"
    ).style.opacity = null;
    this.SEGMENT_COUNT = this.segments.length;
    this.FADE_DELAY_FACTOR = 1 / this.SEGMENT_COUNT;
  }

  progressTowardTarget(timestamp) {
    const elapsed = timestamp - this.prevTimestamp;

    let valueDiff;
    if (this.targetValue > this.value) {
      valueDiff = Math.min(
        elapsed * MAX_INCREASE_PER_MS,
        this.targetValue - this.value
      );
    } else if (this.targetValue < this.value) {
      valueDiff = Math.max(
        -elapsed * MAX_INCREASE_PER_MS,
        this.targetValue - this.value
      );
    } else {
      if (this.state.cssTransitionState !== "exited") {
        this.setSegmentOpacities(this.value);
      }
      this.prevTimestamp = undefined;
      return;
    }

    const interrumValue = this.value + valueDiff;

    this.setSegmentOpacities(interrumValue);

    this.prevTimestamp = timestamp;
    this.value = interrumValue;

    window.requestAnimationFrame(this.step);
  }

  opacityForSegment(index, value) {
    const fadeStartValue = index * this.FADE_DELAY_FACTOR;
    return Math.max(0, (value - fadeStartValue) / this.FADE_DELAY_FACTOR);
  }

  render() {
    const { refContainer: innerRef, percentComplete } = this;

    return (
      <CSSTransition
        in={this.state.transitionEnter}
        timeout={{ enter: 650, exit: 466 }}
        appear
        classNames="hig__progress-ring--"
        onEntering={this.handleEntering}
        onEntered={this.handleEntered}
        onExiting={this.handleExiting}
        onExited={this.handleExited}
      >
        {status =>
          this.props.children({
            innerRef,
            percentComplete,
            cssTransitionState: status
          })
        }
      </CSSTransition>
    );
  }
}
