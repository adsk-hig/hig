import React, { Component } from "react";
import PropTypes from "prop-types";

import MenuBehavior from "./behaviors/MenuBehavior";
import MenuGroupPresenter from "./presenters/MenuGroupPresenter";

export default class MenuGroup extends Component {
  static propTypes = {
    /**
     * Accepts Menu components
     */
    children: PropTypes.node.isRequired,
    /**
     * Default Selected Option(s)
     * Should be the HTML id of the Option
     * This will take precedent over the Menu prop
     * of the same name
     */
    defaultSelected: PropTypes.arrayOf(PropTypes.any),
    /**
     * A callback ref that gets passed to the HTML
     * element with `role="listbox"`
     */
    menuRef: PropTypes.func,
    /**
     * Shows a ability of checkmark to be unchecked if required
     */
    unselect: PropTypes.bool,
    /**
     * Enables multiple selection
     * This will take precedent over the Menu prop
     * of the same name
     */
    multiple: PropTypes.bool,
    /**
     * Called when an option is selected/unselected
     * This will take precedent over the Menu prop of the
     * same name
     */
    onChange: PropTypes.func,
    /**
     * Controls the selected Option(s)
     * This will take precedent over the Menu prop of the
     * same name
     */
    selected: PropTypes.arrayOf(PropTypes.any),
    /**
     * Adds custom/overriding styles
     * This will take precedent over the Menu prop of the
     * same name
     */
    stylesheet: PropTypes.func
  };

  static defaultProps = {
    multiple: false,
    unselect: true
  };

  render() {
    const {
      children,
      defaultSelected,
      menuRef,
      multiple,
      onChange,
      selected,
      unselect,
      stylesheet,
      ...otherProps
    } = this.props;

    return (
      <MenuBehavior
        {...otherProps}
        defaultSelected={defaultSelected}
        menuRef={menuRef}
        multiple={multiple}
        onChange={onChange}
        selected={selected}
        unselect={unselect}
      >
        {({
          getActiveOption,
          getHighlightIndex,
          getOptionsInfo,
          getPreviousEvent,
          handleBlur,
          handleFocus,
          handleKeyDown,
          handleMouseMove,
          setActiveOption,
          setHighlightIndex,
          setMenuRef,
          setOptionsInfo,
          setPreviousEvent
        }) => (
          <MenuGroupPresenter
            {...otherProps}
            defaultSelected={defaultSelected}
            getActiveOption={getActiveOption}
            getHighlightIndex={getHighlightIndex}
            getOptionsInfo={getOptionsInfo}
            getPreviousEvent={getPreviousEvent}
            menuRef={setMenuRef}
            multiple={multiple}
            onBlur={handleBlur}
            onFocus={handleFocus}
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
          </MenuGroupPresenter>
        )}
      </MenuBehavior>
    );
  }
}
