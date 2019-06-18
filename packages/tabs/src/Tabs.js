import React, { Component, Children } from "react";
import Fragment from "render-fragment";
import PropTypes from "prop-types";
import { createButtonEventHandlers } from "@hig/utils";
import { polyfill } from "react-lifecycles-compat";
import memoize from "lodash.memoize";

import { AVAILABLE_ALIGNMENTS, alignments } from "./alignments";
import TabsPresenter from "./presenters/TabsPresenter";
import Tab from "./Tab";

const FIRST_TAB_INDEX = 0;

/**
 * @typedef {import("./Tab").RenderTabPayload} RenderTabPayload
 */

/**
 * @typedef {Object} TabMeta
 * @property {string} key
 * @property {import("./tab").TabProps} props
 */

/**
 * @typedef {Object} TabsProps
 * @property {string} [align]
 * @property {ReactNode} [children]
 */

/**
 * @typedef {Object} TabsState
 * @property {number} activeTabIndex
 */

/**
 * @param {ReactNode} children
 * @returns {TabMeta[]}
 */
function createTabs(children) {
  return Children.toArray(children).reduce((result, child) => {
    const { type, key, props = {} } = child;

    if (type === Tab) {
      result.push({ key, props });
    }

    return result;
  }, []);
}

class Tabs extends Component {
  static propTypes = {
    /**
     * Specify how to justify the tabs within their container
     */
    align: PropTypes.oneOf(AVAILABLE_ALIGNMENTS),
    /**
     * Accepts Tab components
     */
    children: PropTypes.node,
    /**
     * Called when user activates a tab
     */
    onTabChange: PropTypes.func
  };

  static defaultProps = {
    align: alignments.CENTER,
    onTabChange: () => {}
  };

  /** @type {TabsState} */
  state = {
    activeTabIndex: FIRST_TAB_INDEX
  };

  /**
   * @param {TabsProps} nextProps
   * @param {TabsState} prevState
   * @returns {TabsState | null}
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const { children } = nextProps;
    const nextTabs = createTabs(children);
    const nextActiveTabIndex = nextTabs.findIndex(({ props }) => props.active);
    const { activeTabIndex: prevActiveTabIndex } = prevState;

    if (
      // If no active tab was declared
      nextActiveTabIndex < 0 ||
      // If the declared active tab is the same as the current active tab
      nextActiveTabIndex === prevActiveTabIndex
    ) {
      return null;
    }

    return {
      activeTabIndex: nextActiveTabIndex
    };
  }

  createTabEventHandlers = memoize(index =>
    createButtonEventHandlers(() => this.setActiveTab(index))
  );

  /** @returns {TabMeta[]} */
  getTabs() {
    return createTabs(this.props.children);
  }

  /** @returns {TabMeta|undefined} */
  getActiveTab() {
    const { activeTabIndex } = this.state;

    return this.getTabs()[activeTabIndex];
  }

  /**
   * @param {number} nextActiveTabIndex
   */
  setActiveTab(nextActiveTabIndex) {
    const { activeTabIndex: prevActiveTabIndex } = this.state;
    const { onTabChange } = this.props;

    if (prevActiveTabIndex === nextActiveTabIndex) return;

    onTabChange(nextActiveTabIndex);
    this.setState({ activeTabIndex: nextActiveTabIndex });
  }

  /**
   * @param {TabMeta} tab
   * @param {number} index
   * @returns {JSX.Element}
   */
  renderTab = ({ key, props }, index) => {
    const { render, label } = props;
    const { activeTabIndex } = this.state;
    /** @type {RenderTabPayload} */
    const payload = {
      key,
      label,
      active: activeTabIndex === index,
      ...this.createTabEventHandlers(index)
    };

    return render(payload);
  };

  /**
   * @returns {JSX.Element}
   */
  renderTabs() {
    return (
      <TabsPresenter align={this.props.align}>
        {this.getTabs().map(this.renderTab)}
      </TabsPresenter>
    );
  }

  /** @returns {ReactNode} */
  renderContent() {
    const activeTab = this.getActiveTab();

    return activeTab ? activeTab.props.children : null;
  }

  render() {
    return (
      <Fragment>
        {this.renderTabs()}
        {this.renderContent()}
      </Fragment>
    );
  }
}

export default polyfill(Tabs);
