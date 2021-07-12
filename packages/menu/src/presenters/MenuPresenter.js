import React, { Component } from "react";
import PropTypes from "prop-types";
import { css, cx } from "emotion";
import { ThemeContext } from "@hig/theme-context";

import Option from "../Option";
import createChildren from "../behaviors/createChildren";
import stylesheet from "./stylesheet";

export default class MenuPresenter extends Component {
  static propTypes = {
    children: PropTypes.node,
    divider: PropTypes.bool,
    stylesheet: PropTypes.func
  };

  componentDidMount() {
    const optionsInfo = [];

    if (this.props.role !== `group`) {
      React.Children.forEach(this.props.children, child => {
        if (child.type === Option) {
          optionsInfo.push(child.props);
        }
      });

      this.props.setOptionsInfo(optionsInfo);
    }
  }

  componentDidUpdate() {
    // update options if they change, but do not run if the menu is part of a menugroup
    if (this.props.role !== `group`) {
      const previousOptions = this.props.getOptionsInfo();
      const optionsInfo = [];
      const currentIds = [];
      const prevIds = [];

      React.Children.forEach(this.props.children, child => {
        if (child.type === Option) {
          optionsInfo.push(child.props);
          currentIds.push(child.props.id);
        }
      });

      Object.keys(previousOptions).forEach(index => {
        prevIds.push(previousOptions[index].id);
      });

      if (JSON.stringify(currentIds) !== JSON.stringify(prevIds)) {
        this.props.setOptionsInfo(optionsInfo);
      }
    }
  }

  getOptions() {
    return createChildren(this.props.children, Option);
  }

  renderOption = ({ key, props }) => {
    const {
      checkmark,
      getActiveOption,
      getHighlightIndex,
      getOptionsInfo,
      getPreviousEvent,
      multiple,
      onFocus,
      selected,
      setActiveOption,
      setHighlightIndex,
      unselect
    } = this.props;
    const payload = {
      ...props,
      checkmark,
      getActiveOption,
      getHighlightIndex,
      getOptionsInfo,
      getPreviousEvent,
      multiple,
      key,
      onFocus,
      selected,
      setActiveOption,
      setHighlightIndex,
      unselect
    };

    return <Option {...payload} />;
  };

  renderOptions() {
    return this.getOptions().map(this.renderOption);
  }

  render() {
    const {
      checkmark,
      children,
      divider,
      menuRef,
      multiple,
      stylesheet: customStylesheet,
      ...otherProps
    } = this.props;
    const {
      id,
      className,
      getHighlightIndex,
      getOptionsInfo,
      role,
      tabIndex
    } = otherProps;
    const ariaPayload =
      role !== `group`
        ? {
            ...(getHighlightIndex() !== 0 && {
              "aria-activedescendant": getOptionsInfo()[getHighlightIndex() - 1]
                .id
            }),
            ...(multiple && { "aria-multiselectable": multiple })
          }
        : {};
    const payload = { ...otherProps };
    delete payload.getActiveOption;
    delete payload.getHighlightIndex;
    delete payload.getOptionsInfo;
    delete payload.getPreviousEvent;
    delete payload.handleBlur;
    delete payload.handleFocus;
    delete payload.handleKeyDown;
    delete payload.handleMouseMove;
    delete payload.setActiveOption;
    delete payload.setHighlightIndex;
    delete payload.setOptionsInfo;
    delete payload.setPreviousEvent;

    return (
      <ThemeContext.Consumer>
        {({ resolvedRoles }) => {
          const styles = stylesheet(
            {
              checkmark,
              divider,
              stylesheet: customStylesheet
            },
            resolvedRoles
          );
          return (
            <ul
              {...ariaPayload}
              {...payload}
              className={cx([className, css(styles.menu)])}
              id={id}
              ref={menuRef}
              role={role || `listbox`} // set to group if it is w/in a MenuGroup
              tabIndex={tabIndex || `0`} // not focusable if w/in a MenuGroup
            >
              {this.renderOptions()}
            </ul>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
