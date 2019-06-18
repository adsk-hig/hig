import React from "react";
import PropTypes from "prop-types";
import { sample } from "lodash";
import Button from "@hig/button";
import NotificationsToast from "../NotificationsToast";
import { AVAILABLE_STATUSES } from "../statuses";
import NotificationsToastList, {
  AVAILABLE_PLACEMENTS
} from "../NotificationsToastList";

export default class NotificationsToastListInteractions extends React.Component {
  static propTypes = {
    initialToasts: PropTypes.arrayOf(PropTypes.node),
    placement: PropTypes.oneOf(AVAILABLE_PLACEMENTS)
  };

  static defaultProps = {
    initialToasts: []
  };

  constructor(props) {
    super(props);
    this.state = {
      toasts: this.props.initialToasts
    };
  }

  addRandomToast = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const currentToasts = this.state.toasts.slice();
    currentToasts.push(this._generateToast());
    this.setState({ toasts: currentToasts });
  };

  removeToast = ({ key }) => {
    const childIndexToRemove = this.state.toasts.findIndex(
      el => el.key === key
    );

    if (childIndexToRemove > -1) {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const nextToasts = this.state.toasts.slice();
      nextToasts.splice(childIndexToRemove, 1);
      this.setState({ toasts: nextToasts });
    }
  };

  _generateToast = () => {
    const key = Math.random();
    return (
      <NotificationsToast key={key} status={sample(AVAILABLE_STATUSES)}>
        <strong>New Toast</strong> was generated with a unique key and random
        status.
      </NotificationsToast>
    );
  };

  render() {
    return (
      <div>
        <Button onClick={this.addRandomToast} title="Add Random Toast" />

        <NotificationsToastList placement={this.props.placement}>
          {this.state.toasts.map(toast =>
            React.cloneElement(toast, {
              onDismiss: this.removeToast.bind(this, toast)
            })
          )}
        </NotificationsToastList>
      </div>
    );
  }
}
