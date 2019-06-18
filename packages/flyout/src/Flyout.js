import React, { Component } from "react";
import PropTypes from "prop-types";

import { AVAILABLE_ANCHOR_POINTS } from "./anchorPoints";
import ContainerTransition from "./behaviors/ContainerTransition";
import FlyoutPresenter from "./presenters/FlyoutPresenter";
import getCoordinates, { DEFAULT_COORDINATES } from "./getCoordinates";
import DelayedHoverBehavior from "./behaviors/DelayedHoverBehavior";
import PanelContainerPresenter from "./presenters/PanelContainerPresenter";
import PanelPresenter from "./presenters/PanelPresenter";

/** @typedef {import("./getCoordinates").Coordinates} Coordinates */

/**
 * @typedef {Object} PanelRendererPayload
 * @property {function(HTMLElement): void} innerRef
 * @property {function(): void} hideFlyout
 * @property {JSX} [content]
 * @property {function(UIEvent): void} [handleScroll]
 * @property {number} [maxHeight]
 */

/**
 * @typedef {Object} State
 * @property {HTMLElement} [actionRef]
 * @property {boolean} open Used to direct the flyout's transition behavior
 * @property {HTMLElement} [panelRef]
 * @property {SVGSVGElement} [pointerRef]
 * @property {HTMLDivElement} [wrapperRef]
 */

export default class Flyout extends Component {
  static propTypes = {
    /** Manipulate flyout coordinates before rendering */
    alterCoordinates: PropTypes.func,
    /** Where the flyout will be anchored relative to target */
    anchorPoint: PropTypes.oneOf(AVAILABLE_ANCHOR_POINTS),
    /** Target component to open the flyout. Can be either a node or a render function */
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /** Content for the flyout. Can be either a node or a render function */
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /** Default uncontrolled open state */
    defaultOpen: PropTypes.bool,
    /**
     * When the flyout overflows the viewport, it'll attempt to
     * use the given anchor points in order to keep the flyout
     * within the viewport.
     */
    fallbackAnchorPoints: PropTypes.arrayOf(
      PropTypes.oneOf(AVAILABLE_ANCHOR_POINTS)
    ),
    /** Renders a custom flyout panel. Can be either a node or a render function */
    panel: PropTypes.func,
    /** A custom pointer */
    pointer: PropTypes.node,
    /** Max height of the flyout content, in pixels */
    maxHeight: PropTypes.number,
    /** Function called when the flyout is open, and a click event occurs outside the flyout */
    onClickOutside: PropTypes.func,
    /** Function called when the flyout closes */
    onClose: PropTypes.func,
    /** Function called when the flyout opens */
    onOpen: PropTypes.func,
    /** Function called when the flyout panel is scrolled */
    onScroll: PropTypes.func,
    /** When provided, it overrides the flyout's open state */
    open: PropTypes.bool,
    /** Whether flyout should open when the target is hovered over */
    openOnHover: PropTypes.bool,
    /**
     * If openOnHover is true, this prop will determine the delay
     * from when mouseEnter begins until the flyout visually opens
     */
    openOnHoverDelay: PropTypes.number
  };

  static defaultProps = {
    anchorPoint: DEFAULT_COORDINATES.anchorPoint,
    defaultOpen: false,
    fallbackAnchorPoints: AVAILABLE_ANCHOR_POINTS,
    openOnHover: false,
    openOnHoverDelay: 500,
    /**
     * @param {PanelRendererPayload} payload
     */
    panel({ innerRef, content, handleScroll, maxHeight }) {
      return (
        <PanelContainerPresenter innerRef={innerRef} maxHeight={maxHeight}>
          <PanelPresenter onScroll={handleScroll}>{content}</PanelPresenter>
        </PanelContainerPresenter>
      );
    }
  };

  /** @type {State} */
  state = {
    open: this.props.defaultOpen
  };

  componentDidMount() {
    window.document.body.addEventListener("click", this.handleBodyClick);
  }

  componentWillUnmount() {
    window.document.body.removeEventListener("click", this.handleBodyClick);
  }

  /**
   * @returns {Coordinates}
   */
  getCoordinates() {
    const { alterCoordinates, anchorPoint, fallbackAnchorPoints } = this.props;
    const { actionRef, panelRef, pointerRef } = this.state;

    if (
      !actionRef ||
      !panelRef ||
      !pointerRef ||
      typeof window === "undefined"
    ) {
      return DEFAULT_COORDINATES;
    }

    const actionRect = actionRef.getBoundingClientRect();
    const panelRect = panelRef.getBoundingClientRect();
    const pointerRect = pointerRef.getBoundingClientRect();
    const viewportRect = window.document.documentElement.getBoundingClientRect();
    const coordinates = getCoordinates({
      anchorPoint,
      actionRect,
      fallbackAnchorPoints,
      panelRect,
      pointerRect,
      viewportRect
    });

    if (alterCoordinates) {
      const rects = {
        actionRect,
        panelRect,
        pointerRect,
        viewportRect
      };

      return alterCoordinates(coordinates, rects);
    }

    return coordinates;
  }

  /**
   * @param {boolean} open
   */
  setOpen(open) {
    const { onClose, onOpen } = this.props;

    if (open && onOpen) {
      onOpen();
    } else if (!open && onClose) {
      onClose();
    }

    this.setState({ open });
  }

  handleChildMouseEnter = () => {
    if (this.props.openOnHover) {
      this.setOpen(true);
    }
  };

  handleChildMouseLeave = () => {
    if (this.props.openOnHover) {
      this.setOpen(false);
    }
  };

  handleChildClick = () => {
    if (!this.isOpenControlled()) {
      this.toggleOpen();
    }
  };

  /**
   * @param {MouseEvent} event
   */
  handleBodyClick = event => {
    const { wrapperRef } = this.state;
    const { onClickOutside } = this.props;
    const flyoutClicked =
      event.target === wrapperRef || wrapperRef.contains(event.target);

    if (flyoutClicked || !this.isOpen()) return;
    if (onClickOutside) onClickOutside(event);
    if (!this.isOpenControlled()) this.toggleOpen();
  };

  /**
   * @param {HTMLElement} actionRef
   */
  refAction = actionRef => {
    this.setState({ actionRef });
  };

  /**
   * @param {SVGSVGElement} pointerRef
   */
  refPointer = pointerRef => {
    this.setState({ pointerRef });
  };

  /**
   * @param {HTMLElement} panelRef
   */
  refPanel = panelRef => {
    this.setState({ panelRef });
  };

  /**
   * @param {HTMLDivElement} wrapperRef
   */
  refWrapper = wrapperRef => {
    this.setState({ wrapperRef });
  };

  hideFlyout = () => {
    this.setOpen(false);
  };

  isOpen() {
    return this.isOpenControlled() ? this.props.open : this.state.open;
  }

  isOpenControlled() {
    return this.props.open !== undefined;
  }

  toggleOpen() {
    this.setOpen(!this.state.open);
  }

  /**
   * @returns {PanelRendererPayload}
   */
  createPanelPayload() {
    const { hideFlyout } = this;
    const { maxHeight, onScroll } = this.props;

    return {
      hideFlyout,
      maxHeight,
      content: this.renderContent(),
      handleScroll: onScroll,
      innerRef: this.refPanel
    };
  }

  renderContent() {
    const { content } = this.props;
    const { hideFlyout } = this;

    if (typeof content === "function") {
      return content({ hideFlyout });
    }

    return content;
  }

  renderPanel({ transitionStatus }) {
    const { panel } = this.props;

    if (typeof panel === "function") {
      return panel({
        ...this.createPanelPayload(),
        transitionStatus
      });
    }

    return panel;
  }

  renderChildren(onMouseEnter, onMouseLeave) {
    const { children } = this.props;
    const { handleChildClick } = this;

    if (typeof children === "function") {
      return children({ handleClick: handleChildClick });
    }

    if (React.Children.count(children) === 1) {
      return React.cloneElement(children, {
        onClick: handleChildClick,
        onMouseEnter,
        onMouseLeave
      });
    }

    return children;
  }

  renderPresenter = transitionStatus => {
    const {
      handleChildMouseEnter,
      handleChildMouseLeave,
      refAction,
      refPointer,
      refWrapper
    } = this;
    const { openOnHoverDelay, pointer } = this.props;
    const panel = this.renderPanel({ transitionStatus });
    const {
      anchorPoint,
      containerPosition,
      pointerPosition
    } = this.getCoordinates();

    return (
      <DelayedHoverBehavior
        onMouseEnter={handleChildMouseEnter}
        onMouseLeave={handleChildMouseLeave}
        openOnHoverDelay={openOnHoverDelay}
      >
        {({ onMouseEnter, onMouseLeave }) => (
          <FlyoutPresenter
            anchorPoint={anchorPoint}
            containerPosition={containerPosition}
            panel={panel}
            pointer={pointer}
            pointerPosition={pointerPosition}
            refAction={refAction}
            refPointer={refPointer}
            refWrapper={refWrapper}
            transitionStatus={transitionStatus}
          >
            {this.renderChildren(onMouseEnter, onMouseLeave)}
          </FlyoutPresenter>
        )}
      </DelayedHoverBehavior>
    );
  };

  render() {
    return (
      <ContainerTransition open={this.isOpen()}>
        {this.renderPresenter}
      </ContainerTransition>
    );
  }
}
