import React from "react";
import PropTypes from "prop-types";
import Downshift from "downshift";
import { combineEventHandlers } from "@hig/utils";

/**
 * @typedef {import("downshift").DownshiftProps<any>} Props
 * @property {any[]} selectedItems
 */

/**
 * @typedef {Object} GetRemoveButtonPropsOptions
 * @property {function(MouseEvent)} onClick
 * @property {any} item
 */

/**
 * @typedef {import("downshift").ControllerStateAndHelpers<any>} ControllerStateAndHelpers
 * @property {function(GetRemoveButtonPropsOptions): any} getRemoveButtonProps
 * @property {any[]} selectedItems
 */

export default class MultiDownshift extends React.Component {
  static propTypes = {
    ...Downshift.propTypes,
    /** Controlled: the currently selected items */
    selectedItems: PropTypes.arrayOf(PropTypes.any),
    /** Items selected by default */
    defaultSelectedItems: PropTypes.arrayOf(PropTypes.any),
    /** Alias of `defaultSelectedItems` for consistency with Downshift */
    initialSelectedItems: PropTypes.arrayOf(PropTypes.any)
  };

  static defaultProps = {
    defaultSelectedItems: []
  };

  state = {
    selectedItems: this.getDefaultSelectedItem()
  };

  getDefaultSelectedItem() {
    const {
      initialSelectedItems,
      defaultSelectedItems = initialSelectedItems
    } = this.props;

    return defaultSelectedItems;
  }

  /**
   * @returns {any[]}
   */
  getSelectedItems() {
    const controlledSelectedItems = this.props.selectedItems;
    const { selectedItems } = this.state;

    return controlledSelectedItems !== undefined
      ? controlledSelectedItems
      : selectedItems;
  }

  /**
   * @param {import("downshift").ControllerStateAndHelpers<any>} downshift
   * @returns {ControllerStateAndHelpers}
   */
  getStateAndHelpers(downshift) {
    const selectedItems = this.getSelectedItems();
    const { getRemoveButtonProps } = this;

    return {
      ...downshift,
      getRemoveButtonProps,
      selectedItems
    };
  }

  /**
   * @param {GetRemoveButtonPropsOptions} options
   * @returns {any}
   */
  getRemoveButtonProps = ({ onClick, item, ...props } = {}) => {
    /**
     * @param {MouseEvent} event
     */
    const handleRemoveButtonClick = event => {
      event.stopPropagation();
      this.unselectItem(item);
    };

    const handleClick = combineEventHandlers(onClick, handleRemoveButtonClick);

    return {
      ...props,
      onClick: handleClick
    };
  };

  /**
   * @returns {import("downshift").ControllerStateAndHelpers}
   */
  getDownshiftProps() {
    const { children, inputValue, ...otherProps } = this.props;
    const controlledInputValue =
      inputValue !== undefined ? inputValue : this.selectedItemsToString();

    return {
      ...otherProps,
      inputValue: controlledInputValue,
      onSelect: this.handleSelect,
      stateReducer: this.stateReducer
    };
  }

  /**
   * @param {import("downshift").DownshiftState<any>} state
   * @param {import("downshift").StateChangeOptions<any>} changes
   * @returns {import("downshift").Partial<StateChangeOptions<any>>}
   */
  stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: true
        };
      default:
        return changes;
    }
  };

  /**
   * @param {any} selectedItem
   * @param {import("downshift").ControllerStateAndHelpers} downshift
   */
  handleSelect = (selectedItem, downshift) => {
    const selectedItems = this.getSelectedItems();
    const triggerChange = this.createChangeTrigger(downshift);

    if (selectedItems.includes(selectedItem)) {
      this.unselectItem(selectedItem, triggerChange);
    } else {
      this.selectItem(selectedItem, triggerChange);
    }
  };

  /**
   * @param {import("downshift").ControllerStateAndHelpers} downshift
   */
  createChangeTrigger(downshift) {
    const multiDownshift = this.getStateAndHelpers(downshift);

    return () => {
      const { onChange } = this.props;
      const selectedItems = this.getSelectedItems();

      if (onChange) {
        onChange(selectedItems, multiDownshift);
      }
    };
  }

  /**
   * @returns {string}
   * @todo Add intelligent formatting
   */
  selectedItemsToString() {
    const { itemToString } = this.props;
    const selectedItems = this.getSelectedItems();

    return selectedItems.map(itemToString).join(", ");
  }

  /**
   * @param {any} item
   * @param {Function} done
   */
  unselectItem(item, done) {
    const selectedItems = this.getSelectedItems();
    const nextSelectedItems = selectedItems.filter(
      selectedItem => selectedItem !== item
    );

    this.setState({ selectedItems: nextSelectedItems }, done);
  }

  /**
   * @param {any} removedItem
   * @param {Function} done
   */
  selectItem(item, done) {
    const selectedItems = this.getSelectedItems();
    const nextSelectedItems = [...selectedItems, item];

    this.setState({ selectedItems: nextSelectedItems }, done);
  }

  /**
   * @param {import("downshift").ControllerStateAndHelpers} downshift
   */
  renderPresenter = downshift =>
    this.props.children(this.getStateAndHelpers(downshift));

  render() {
    return (
      <Downshift {...this.getDownshiftProps()}>
        {this.renderPresenter}
      </Downshift>
    );
  }
}
