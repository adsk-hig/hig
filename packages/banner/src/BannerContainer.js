import { Component } from "react";
import PropTypes from "prop-types";

/**
 * @typedef {Object} PresenterBag
 * @property {boolean} isWrappingContent
 * @property {function(HTMLDivElement)} refContent
 * @property {function(HTMLParagraphElement)} refNotification
 * @property {function(HTMLDivElement)} refInteractionsWrapper
 * @property {any} [children]
 */

/**
 * @typedef {Object} BannerContainerProps
 * @property {any} [actions]
 * @property {Function} [onReady]
 * @property {function(PresenterBag): any} [children]
 */

/**
 * @typedef {Object} BannerContainerState
 * @property {boolean} isWrappingActions
 * @property {boolean} isWrappingContent
 */

/** The minimum space between the notification and actions */
const MIN_CONTENT_SPACING = 125;
/** The minimum width of the notification */
const MIN_NOTIFICATION_WIDTH = 200;
/** The width of the notification at which actions will begin wrapping */
const ACTIONS_WRAPPING_THRESHOLD = 300;

/** @type {Component<BannerContainerProps, BannerContainerState>} */
export default class BannerContainer extends Component {
  static propTypes = {
    /** Banner actions; Any JSX, or a render prop function */
    actions: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /** Called after the component has been mounted, and dynamically resized */
    onReady: PropTypes.func,
    /** A render prop function to render a `BannerPresenter` */
    children: PropTypes.func.isRequired
  };

  /** @type {BannerContainerState} */
  state = {
    isWrappingActions: false,
    isWrappingContent: false
  };

  componentDidMount() {
    this.bindResize();
    this.updateWrapping(this.props.onReady);
  }

  componentWillUnmount() {
    this.unbindResize();
    this.cancelWrappingUpdate();
  }

  /**
   * @param {HTMLDivElement} element
   */
  refContent = element => {
    this.content = element;
  };

  /**
   * @param {HTMLParagraphElement} element
   */
  refNotification = element => {
    this.notification = element;
  };

  /**
   * @param {HTMLDivElement} element
   */
  refInteractionsWrapper = element => {
    this.interactionsWrapper = element;
  };

  handleResize = () => {
    this.updateWrapping();
  };

  /**
   * @param {Function} callback
   */
  updateContentWrapping = callback => {
    const update = { isWrappingContent: this.shouldWrapContent() };

    this.setState(update, () => {
      delete this.wrappingFrame;

      if (callback) callback();
    });
  };

  /**
   * @param {Function} callback
   */
  updateActionWrapping = callback => {
    const update = { isWrappingActions: this.shouldWrapActions() };

    this.setState(update, () => {
      this.wrappingFrame = window.requestAnimationFrame(() => {
        this.updateContentWrapping(callback);
      });
    });
  };

  /**
   * Determines whether actions should wrap on the next repaint
   * @returns {boolean}
   */
  shouldWrapActions() {
    const { interactionsWrapper } = this;

    if (!interactionsWrapper) return false;

    const { isWrappingActions } = this.state;
    const notificationWidth = isWrappingActions
      ? ACTIONS_WRAPPING_THRESHOLD + interactionsWrapper.offsetWidth * 2
      : ACTIONS_WRAPPING_THRESHOLD;

    return this.willContentOverflow(notificationWidth);
  }

  /**
   * Determines whether content should wrap on the next repaint
   * @returns {boolean}
   */
  shouldWrapContent() {
    return this.willContentOverflow(MIN_NOTIFICATION_WIDTH);
  }

  /**
   * Determines whether the content will overflow its container
   * with the given width of the notification element.
   *
   * @param {number} notificationWidth
   * @returns {boolean}
   */
  willContentOverflow(notificationWidth) {
    const { content, interactionsWrapper } = this;

    if (!content || !interactionsWrapper) return false;

    const contentWidth = content.offsetWidth;
    const actionsWidth = interactionsWrapper.offsetWidth;
    const contentChildrenWidth =
      notificationWidth + MIN_CONTENT_SPACING + actionsWidth;

    return contentChildrenWidth > contentWidth;
  }

  /** @type {BannerContainerProps | any} */
  props;

  /** @type {HTMLDivElement | undefined} */
  content;

  /** @type {HTMLDivElement | undefined} */
  interactionsWrapper;

  /** @type {HTMLParagraphElement | undefined} */
  notification;

  /** @type {number | undefined} */
  wrappingFrame;

  /**
   * Asynchronously updates the wrapping behavior of the presenter
   * @param {Function} callback
   */
  updateWrapping(callback) {
    if (this.wrappingFrame !== undefined) return;

    this.wrappingFrame = window.requestAnimationFrame(() => {
      this.updateActionWrapping(callback);
    });
  }

  cancelWrappingUpdate() {
    if (this.wrappingFrame !== undefined) {
      window.cancelAnimationFrame(this.wrappingFrame);
    }
  }

  bindResize() {
    window.addEventListener("resize", this.handleResize);
  }

  unbindResize() {
    window.removeEventListener("resize", this.handleResize);
  }

  /**
   * @returns {PresenterBag}
   */
  createPresenterBag() {
    const { isWrappingContent } = this.state;
    const { refContent, refNotification, refInteractionsWrapper } = this;

    return {
      isWrappingContent,
      refContent,
      refNotification,
      refInteractionsWrapper,
      actions: this.renderActions()
    };
  }

  /** @returns {any} */
  renderActions() {
    const { actions } = this.props;

    if (typeof actions !== "function") return actions;

    const { isWrappingContent, isWrappingActions } = this.state;
    const actionsBag = { isWrappingContent, isWrappingActions };

    return actions(actionsBag);
  }

  render() {
    const { children: renderPresenter } = this.props;
    const presenterBag = this.createPresenterBag();

    return renderPresenter(presenterBag);
  }
}
