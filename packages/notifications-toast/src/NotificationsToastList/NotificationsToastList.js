import React from "react";
import PropTypes from "prop-types";
import { css } from "emotion";
import NotificationsToastListAnimator from "./NotificationsToastListAnimator";
import { placements, AVAILABLE_PLACEMENTS } from "./placements";

import stylesheet from "./NotificationsToastList.stylesheet";

const MAX_TOASTS_ONSCREEN = 3;

export default class NotificationsToastList extends React.Component {
  static AVAILABLE_PLACEMENTS = AVAILABLE_PLACEMENTS;

  static placements = placements;

  render() {
    const { children, placement } = this.props;
    const keyedChildren = React.Children.toArray(children);
    const styles = stylesheet(placement);

    return (
      <div className={css(styles.toastListWrapper)}>
        <NotificationsToastListAnimator placement={placement}>
          {keyedChildren.slice(0, MAX_TOASTS_ONSCREEN)}
        </NotificationsToastListAnimator>
      </div>
    );
  }
}

NotificationsToastList.propTypes = {
  /**
   * Determines the placement of the NotificationsToastList.
   * The list will be sorted such that the most recently added notification will
   *  appear closest to the page edge.
   */
  placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS),
  /**
   * A list of Toast elements to render
   */
  children: PropTypes.node
};
