import React, { Component } from "react";
import PropTypes from "prop-types";

import { AVAILABLE_TARGETS } from "../targets";
import ModulePresenter from "./presenters/ModulePresenter";

export default class Module extends Component {
  static propTypes = {
    /** Indicates this module is currently active */
    active: PropTypes.bool,
    /** Indicates a nested submodule is currently active */
    activeChildren: PropTypes.bool,
    /** Zero or more SideNav submodules */
    children: PropTypes.node,
    /** An instance of @hig/icon */
    icon: PropTypes.node,
    /** URL to navigate to when clicking this module */
    link: PropTypes.string,
    /** Indicates whether to display nested submodules */
    minimized: PropTypes.bool,
    /** Called when clicking on the collapse button */
    onClickCollapseButton: PropTypes.func,
    /** Called when clicking on the title */
    onClickTitle: PropTypes.func,
    /** Called when link is focused  */
    onFocus: PropTypes.func,
    /** Called when hovering over the title */
    onMouseOver: PropTypes.func,
    /** A label for rendering this Module */
    title: PropTypes.string.isRequired,
    /** Anchor target. Applicable only if link is provided */
    target: PropTypes.oneOf(AVAILABLE_TARGETS)
  };

  static defaultProps = {
    minimized: false
  };

  state = {
    minimized: this.props.minimized
  };

  componentDidUpdate() {
    const { children, link } = this.props;

    if (children && link) {
      /* eslint-disable-next-line no-console */
      console.error(
        "A module shouldn't be both a link and contain sub-modules"
      );
    }
  }

  /**
   * @param {Function} callback, function to call after minimize state has been toggled
   * @returns {Function}
   */
  createMinimizeToggler = callback => () => {
    this.setState(
      // eslint-disable-next-line react/no-access-state-in-setstate
      { minimized: !this.state.minimized },
      () => callback && callback()
    );
  };

  /**
   * @returns {PresenterBag}
   */
  createPresenterBag() {
    const { minimized } = this.state;

    return {
      minimized,
      onClickCollapseButton: this.createMinimizeToggler(
        this.props.onClickCollapseButton
      ),
      onClickTitle: this.createMinimizeToggler(this.props.onClickTitle)
    };
  }

  /**
   * @param {PresenterBag}
   */
  renderPresenter = presenterBag => {
    const presenterProps = { ...this.props, ...presenterBag };
    const { children, ...otherProps } = presenterProps;

    return <ModulePresenter {...otherProps}>{children}</ModulePresenter>;
  };

  render() {
    const presenterBag = this.createPresenterBag();
    const { renderPresenter } = this;

    return renderPresenter(presenterBag);
  }
}
