import React, { Component } from "react";
import PropTypes from "prop-types";
import { PressedBehavior } from "@hig/behaviors";

import OptionBehavior from "./behaviors/OptionBehavior";
import OptionPresenter from "./presenters/OptionPresenter";

import { roles, AVAILABLE_ROLES } from "./constants";

export default class Option extends Component {
  static propTypes = {
    /**
     * Allows for an asset before the Option text
     * Can be from @hig/avatar, @hig/icons or
     * whatever image of yor choosing
     */
    asset: PropTypes.node,
    /**
     * Content of the Option
     */
    children: PropTypes.node.isRequired,
    /**
     * Disables the Option
     */
    disabled: PropTypes.bool,
    /**
     * HTML unique id for the element
     */
    id: PropTypes.string.isRequired,
    /**
     * HTML attribute for accessibility
     */
    role: PropTypes.oneOf(AVAILABLE_ROLES),
    /**
     * Allows for a keyboard shortcut or any
     * content to the right of the Option content
     */
    shortcut: PropTypes.node,
    /**
     * Adds custom/overriding styles
     */
    stylesheet: PropTypes.func
  };

  static defaultProps = {
    role: roles.OPTION
  };

  render() {
    const {
      asset,
      children,
      disabled,
      id,
      role,
      shortcut,
      stylesheet,
      unselect,
      ...otherProps
    } = this.props;
    const {
      getHighlightIndex,
      onFocus,
      onMouseDown,
      onMouseLeave,
      onMouseUp
    } = otherProps;

    return (
      <PressedBehavior
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {({
          isPressed,
          onMouseDown: handleMouseDown,
          onMouseUp: handleMouseUp,
          onPressedMouseLeave: handlePressedMouseLeave
        }) => (
          <OptionBehavior
            {...otherProps}
            disabled={disabled}
            id={id}
            onMouseLeave={handlePressedMouseLeave}
            role={role}
          >
            {({
              getIndexFromId,
              handleClick,
              handleMouseEnter,
              handleMouseLeave,
              handleMouseOver,
              isActive
            }) => (
              <OptionPresenter
                {...otherProps}
                asset={asset}
                disabled={disabled}
                highlighted={getHighlightIndex() === getIndexFromId(id) + 1}
                id={id}
                isPressed={isPressed}
                onClick={handleClick}
                onFocus={onFocus}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseOver={handleMouseOver}
                onMouseUp={handleMouseUp}
                role={role}
                selected={isActive()}
                shortcut={shortcut}
                stylesheet={stylesheet}
                unselect={unselect}
              >
                {children}
              </OptionPresenter>
            )}
          </OptionBehavior>
        )}
      </PressedBehavior>
    );
  }
}
