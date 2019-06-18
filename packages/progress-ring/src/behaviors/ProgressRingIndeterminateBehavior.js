import React, { Component } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";

const CYCLE_DURATION = 1000;
const FADE_DURATION = 416;

export default class ProgressRingIndeterminateBehavior extends Component {
  static propTypes = {
    /** Render prop */
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.startTime = undefined;
  }

  state = {
    cssTransitionState: null
  };

  componentDidUpdate() {
    this.initSegments();
    this.step(1);
  }

  setSegmentOpacities(elapsedThisCycle) {
    this.segments.forEach((segment, i) => {
      const index = Math.abs(i - this.SEGMENT_COUNT) - 1;
      const eachSegment = segment;

      eachSegment.style.opacity = this.opacityForSegment(
        index,
        elapsedThisCycle
      );
    });
  }

  step = timestamp => {
    if (!this.playing) {
      return;
    }
    if (this.state.cssTransitionState !== "entered") {
      window.requestAnimationFrame(this.step);
      return;
    }

    if (!this.startTime) this.startTime = timestamp;
    const elapsed = timestamp - this.startTime;
    const elapsedThisCycle = elapsed % CYCLE_DURATION;

    this.setSegmentOpacities(elapsedThisCycle);

    window.requestAnimationFrame(this.step);
  };

  handleEntering = () => {
    this.setState({ cssTransitionState: "entering" });
  };

  handleEntered = () => {
    this.setState({ cssTransitionState: "entered" });
    this.start();
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

  initSegments() {
    this.segments = Array.from(
      this.containerRef.querySelectorAll(".hig__progress-ring__segment")
    );

    this.containerRef.querySelector(
      ".hig__progress-ring__mask"
    ).style.opacity = null;
    this.SEGMENT_COUNT = this.segments.length;
    this.SEGMENT_DELAY_FACTOR = CYCLE_DURATION / this.SEGMENT_COUNT;
  }

  opacityForSegment(index, elapsedThisCycle) {
    const segmentFadeStartTime = index * this.SEGMENT_DELAY_FACTOR;

    // Fade continuing from previous cycle
    if (
      segmentFadeStartTime + FADE_DURATION > CYCLE_DURATION &&
      elapsedThisCycle < FADE_DURATION
    ) {
      return (
        ((elapsedThisCycle + CYCLE_DURATION - segmentFadeStartTime) /
          FADE_DURATION -
          1) *
        -1
      );
    }

    // Fade has finished
    if (
      elapsedThisCycle < segmentFadeStartTime ||
      elapsedThisCycle > segmentFadeStartTime + FADE_DURATION
    ) {
      return 0;
    }

    // Fading
    return Math.abs(
      (elapsedThisCycle - segmentFadeStartTime) / FADE_DURATION - 1
    );
  }

  start() {
    this.playing = true;
    this.startTime = undefined;
    window.requestAnimationFrame(this.step);
  }

  render() {
    const { refContainer: innerRef } = this;

    return (
      <CSSTransition
        in
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
            cssTransitionState: status
          })
        }
      </CSSTransition>
    );
  }
}
