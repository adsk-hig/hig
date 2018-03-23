import React from "react";
import FlipMove from "react-flip-move";
import "./toasts.scss";

const MAX_TOASTS_ONSCREEN = 3;

export default class Toasts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: React.Children.toArray(this.props.children)
    };
  }

  handleDismiss = key => {
    const childIndexToRemove = this.state.items.findIndex(el => el.key === key);

    if (childIndexToRemove > -1) {
      const newItems = this.state.items.slice();
      newItems.splice(childIndexToRemove, 1);
      this.setState({ items: newItems });
    }
  };

  render() {
    return (
      <FlipMove
        className="hig__toasts"
        duration={1000}
        easing="ease-out"
        enterAnimation="fade"
        leaveAnimation="fade"
      >
        {this.state.items.slice(0, MAX_TOASTS_ONSCREEN).map(child =>
          React.cloneElement(child, {
            onDismiss: this.handleDismiss.bind(this, child.key)
          })
        )}
      </FlipMove>
    );
  }
}
