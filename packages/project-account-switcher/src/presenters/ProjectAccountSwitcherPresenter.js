import React, { Component } from "react";
import PropTypes from "prop-types";
import { css } from "emotion";
import { Caret24 } from "@hig/icons";
import Typography from "@hig/typography";
import { memoizeCreateButtonEventHandlers } from "@hig/utils";

import constructPlaceholder from "./constructPlaceholder";
import stylesheet from "./stylesheet";

export default class ProjectAccountSwitcherPresenter extends Component {
  static propTypes = {
    /** List of Accounts */
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        image: PropTypes.string,
        label: PropTypes.string
      })
    ),
    /** Currently selected Account */
    activeAccountObj: PropTypes.shape({
      id: PropTypes.string,
      image: PropTypes.string,
      label: PropTypes.string
    }),
    /** Label for selected Accounts and Projects */
    activeLabel: PropTypes.string,
    /** Currently selected Project */
    activeProjectObj: PropTypes.shape({
      id: PropTypes.string,
      image: PropTypes.string,
      label: PropTypes.string
    }),
    /** Handles Flyout display, passed from Behavior */
    onTargetClick: PropTypes.func,
    /** List of Projects */
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        image: PropTypes.string,
        label: PropTypes.string
      })
    )
  };

  createTargetHandlers = memoizeCreateButtonEventHandlers();

  // this method constructs the image placeholder for the combination of
  // the current activeAccountObj and/or activeProjectObj,
  // in lieu of an image for either
  constructLabelPlaceholder() {
    const placeholders = [];
    const { activeAccountObj, activeProjectObj } = this.props;

    if (activeAccountObj) {
      placeholders.push(activeAccountObj.label);
    }

    if (activeProjectObj) {
      placeholders.push(activeProjectObj.label);
    }

    return placeholders.map(constructPlaceholder).join("/");
  }

  componentHasNoLists() {
    const { accounts = [], projects = [] } = this.props;

    return !accounts.length && !projects.length;
  }

  activeImage() {
    const { activeAccountObj = {}, activeProjectObj = {} } = this.props;
    const { image: activeAccountImage } = activeAccountObj;
    const { image: activeProjectImage } = activeProjectObj;

    return activeAccountImage || activeProjectImage || "";
  }

  renderLabel() {
    const { activeLabel, activeAccountObj, activeProjectObj } = this.props;

    if (activeLabel) return activeLabel;

    const labels = [];

    if (activeAccountObj) {
      labels.push(activeAccountObj.label);
    }
    if (activeProjectObj) {
      labels.push(activeProjectObj.label);
    }

    return labels.join(" / ");
  }

  render() {
    if (this.componentHasNoLists()) {
      /* eslint-disable-next-line no-console */
      console.warn("You must provide a list of accounts or projects");
      return null;
    }

    const label = this.renderLabel();
    const { onTargetClick } = this.props;
    const {
      handleClick: handleTargetClick,
      handleKeyDown: handleTargetKeyDown
    } = this.createTargetHandlers(onTargetClick);
    const styles = stylesheet();

    return (
      <div
        className={css(styles.target)}
        onClick={handleTargetClick}
        onKeyDown={handleTargetKeyDown}
        role="button"
        tabIndex="0"
      >
        <div className={css(styles.targetItem)}>
          <span className={css(styles.imageWrapper)}>
            <img
              className={css(styles.image)}
              alt={label}
              src={this.activeImage()}
            />
            <Typography
              elementType="span"
              style={{ textAlign: "center", lineHeight: "32px" }}
            >
              {this.constructLabelPlaceholder()}
            </Typography>
          </span>
          <Typography>{label}</Typography>
        </div>
        <div className={css(styles.targetCaret)}>
          <Caret24 />
        </div>
      </div>
    );
  }
}
