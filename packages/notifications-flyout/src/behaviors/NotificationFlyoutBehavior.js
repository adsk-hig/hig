/* eslint-disable react/no-unused-prop-types */

import { Component } from "react";
import PropTypes from "prop-types";
import { polyfill } from "react-lifecycles-compat";

import parseNotifications from "./parseNotifications";

/** @typedef {import("./parseNotifications").Input} NotificationsInput */
/** @typedef {import("./parseNotifications").ParsedNotification} ParsedNotification */
/** @typedef {import("./NotificationBehavior").Payload} NotificationBehaviorPayload */

/**
 * @typedef {Object} Payload
 * @property {Function} dismissNotification
 * @property {ParsedNotification[]} notifications
 * @property {boolean} showUnreadCount
 * @property {number} unreadCount
 */

/**
 * @typedef {Object} Props
 * @property {function(Payload): import("react").ReactElement} [children]
 * @property {NotificationsInput} [notifications]
 * @property {number} [unreadCount]
 */

/**
 * @typedef {Object} State
 * @property {string[]} dismissedNotifications An array of notification IDs that have been dismissed
 * @property {ParsedNotification[]} notifications
 * @property {string[]} readNotifications An array of notification IDs that have been read
 */

class NotificationFlyoutBehavior extends Component {
  static propTypes = {
    /** Render prop */
    children: PropTypes.func.isRequired,
    /** Rendered notifications */
    notifications: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.node, PropTypes.shape({})])
      )
    ]),
    /** When provided, it overrides the derived unread notification count */
    unreadCount: PropTypes.number
  };

  /** @type {State} */
  state = {
    dismissedNotifications: [],
    notifications: [],
    readNotifications: []
  };

  /**
   * @param {Props} nextProps
   * @returns {State | null}
   */
  static getDerivedStateFromProps(nextProps) {
    return {
      notifications: parseNotifications(nextProps.notifications)
    };
  }

  /**
   * @returns {ParsedNotification[]}
   */
  getNotifications() {
    const {
      dismissedNotifications,
      notifications,
      readNotifications
    } = this.state;

    const updateReadStatus = ({ id, unread, ...otherProps }) => ({
      id,
      unread: unread && !readNotifications.includes(id),
      ...otherProps
    });
    const isNotDismissed = ({ id }) => !dismissedNotifications.includes(id);

    return notifications.map(updateReadStatus).filter(isNotDismissed);
  }

  /** @returns {number} */
  getUnreadCount() {
    const { unreadCount: controlledUnreadCount } = this.props;

    return controlledUnreadCount !== undefined
      ? controlledUnreadCount
      : this.deriveUnreadCount();
  }

  /**
   * Action to dismiss a notification
   * @param {string} id
   */
  dismissNotification = id => {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      dismissedNotifications: this.state.dismissedNotifications.concat(id)
    });
  };

  /**
   * Handler for when the flyout opens
   */
  handleClose = () => {
    this.markAllNotificationsRead();
  };

  /** @type {Props} */
  props;

  markAllNotificationsRead() {
    const notifications = this.getNotifications();
    const { readNotifications } = this.state;
    const nextRead = notifications.reduce((result, notification) => {
      const { id } = notification;

      if (!result.includes(id)) result.push(id);

      return result;
    }, readNotifications.slice());

    this.setState({ readNotifications: nextRead });
  }

  /**
   * @param {ParsedNotification[]} notifications
   */
  deriveUnreadCount() {
    return this.getNotifications().reduce(
      (count, { unread }) => (unread ? count + 1 : count),
      0
    );
  }

  /**
   * @returns {import("react").ReactElement}
   */
  render() {
    const { dismissNotification, handleClose } = this;
    const notifications = this.getNotifications();
    const unreadCount = this.getUnreadCount();
    const showUnreadCount = unreadCount > 0;

    return this.props.children({
      dismissNotification,
      handleClose,
      notifications,
      showUnreadCount,
      unreadCount
    });
  }
}

export default polyfill(NotificationFlyoutBehavior);
