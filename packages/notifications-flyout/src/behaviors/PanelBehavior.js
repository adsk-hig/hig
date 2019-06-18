import React, { Component } from "react";
import PropTypes from "prop-types";
import Transition from "react-transition-group/Transition";
import { transitionStatuses, AVAILABLE_TRANSITION_STATUSES } from "@hig/flyout";

/** 50px per the design spec plus 30px for the height of the title */
const BOTTOM_SPACING = 80;
const TRANSITION_DURATION = 300;

/**
 * @param {HTMLDivElement} listWrapper
 * @returns {string}
 */
function calculateListMaxHeight(listWrapper) {
  if (!listWrapper) return "";

  const { top: listWrapperTop } = listWrapper.getBoundingClientRect();

  // Distance between the top of the list wrapper and the spacing at the bottom of the screen
  const height = window.innerHeight - BOTTOM_SPACING - listWrapperTop;

  return `${height}px`;
}

export default class PanelBehavior extends Component {
  state = {
    listMaxHeight: ""
  };

  componentDidMount() {
    this.bindResize();
    this.updateMaxHeight();
  }

  componentDidUpdate(previousProps) {
    if (
      previousProps.transitionStatus === transitionStatuses.HIDDEN &&
      this.props.transitionStatus === transitionStatuses.EXITED
    ) {
      window.requestAnimationFrame(() => {
        this.updateMaxHeight();
      });
    }
  }

  componentWillUnmount() {
    this.unbindResize();
  }

  handleResize = () => {
    this.updateMaxHeight();
  };

  /**
   * @param {HTMLDivElement} listWrapperRef
   */
  refListWrapper = listWrapperRef => {
    this.listWrapperRef = listWrapperRef;
  };

  updateMaxHeight() {
    this.setState({
      listMaxHeight: calculateListMaxHeight(this.listWrapperRef)
    });
  }

  bindResize() {
    window.addEventListener("resize", this.handleResize);
  }

  unbindResize() {
    window.removeEventListener("resize", this.handleResize);
  }

  /**
   * @type {HTMLDivElement}
   */
  listWrapperRef;

  render() {
    const { refListWrapper } = this;
    const { children, loading } = this.props;
    const { listMaxHeight } = this.state;

    return (
      <Transition in={loading} timeout={TRANSITION_DURATION}>
        {loadingTransitionState =>
          children({
            loadingTransitionState,
            listMaxHeight,
            refListWrapper
          })
        }
      </Transition>
    );
  }
}

PanelBehavior.propTypes = {
  children: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  transitionStatus: PropTypes.oneOf(AVAILABLE_TRANSITION_STATUSES)
};

PanelBehavior.defaultProps = {
  loading: false
};
