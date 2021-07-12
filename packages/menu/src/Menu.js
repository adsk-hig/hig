import React, { Component } from "react";
import PropTypes from "prop-types";
import { FocusBehavior } from "@hig/behaviors";

import MenuBehavior from "./behaviors/MenuBehavior";
import MenuPresenter from "./presenters/MenuPresenter";

export default class Menu extends Component {
  static propTypes = {
    /**
     * Shows a checkmark selection indicator
     */
    checkmark: PropTypes.bool,
    /**
     * Shows a ability of checkmark to be unchecked if required
     */
    unselect: PropTypes.bool,
    /**
     * Accepts Option components
     */
    children: PropTypes.node.isRequired,
    /**
     * Default Selected Option(s)
     * Should be the HTML id of the Option
     */
    defaultSelected: PropTypes.arrayOf(PropTypes.any),
    /**
     * Shows a divider at the bottom of the menu
     */
    divider: PropTypes.bool,
    /**
     * A callback ref that gets passed to the HTML
     * element with `role="listbox"`
     */
    menuRef: PropTypes.func,
    /**
     * Enables multiple selection
     */
    multiple: PropTypes.bool,
    /**
     * Called when an option is selected/unselected
     */
    onChange: PropTypes.func,
    /**
     * Controls the selected Option(s)
     * This will not work if this is the child
     * of a MenuGroup component
     */
    selected: PropTypes.arrayOf(PropTypes.any),
    /**
     * Adds custom/overriding styles
     */
    stylesheet: PropTypes.func
  };

  static defaultProps = {
    multiple: false,
    unselect: true
  };

  render() {
    const {
      checkmark,
      unselect,
      children,
      defaultSelected,
      divider,
      menuRef,
      multiple,
      onChange,
      selected,
      stylesheet,
      ...otherProps
    } = this.props;
    const { onBlur, onFocus, onKeyDown } = otherProps;

    return (
      <FocusBehavior onBlur={onBlur} onFocus={onFocus}>
        {({ hasFocus, onBlur: handleBlur, onFocus: handleFocus }) => (
          <MenuBehavior
            {...otherProps}
            defaultSelected={defaultSelected}
            hasFocus={hasFocus}
            menuRef={menuRef}
            multiple={multiple}
            onBlur={handleBlur}
            onChange={onChange}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            selected={selected}
            unselect={unselect}
          >
            {({
              getActiveOption,
              getHighlightIndex,
              getOptionsInfo,
              getPreviousEvent,
              handleBlur: handleMenuBehaviorBlur,
              handleFocus: handleMenuBehaviorFocus,
              handleKeyDown,
              handleMouseMove,
              setActiveOption,
              setHighlightIndex,
              setMenuRef,
              setOptionsInfo,
              setPreviousEvent
            }) => (
              <MenuPresenter
                {...otherProps}
                checkmark={checkmark}
                divider={divider}
                getActiveOption={getActiveOption}
                getHighlightIndex={getHighlightIndex}
                getOptionsInfo={getOptionsInfo}
                getPreviousEvent={getPreviousEvent}
                menuRef={setMenuRef}
                multiple={multiple}
                onBlur={handleMenuBehaviorBlur}
                onFocus={handleMenuBehaviorFocus}
                onKeyDown={handleKeyDown}
                onMouseMove={handleMouseMove}
                selected={selected}
                setActiveOption={setActiveOption}
                setHighlightIndex={setHighlightIndex}
                setOptionsInfo={setOptionsInfo}
                setPreviousEvent={setPreviousEvent}
                unselect={unselect}
                stylesheet={stylesheet}
              >
                {children}
              </MenuPresenter>
            )}
          </MenuBehavior>
        )}
      </FocusBehavior>
    );
  }
}
