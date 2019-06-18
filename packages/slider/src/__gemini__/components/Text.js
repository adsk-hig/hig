import React from "react";
import PropTypes from "prop-types";

import ThemeContext from "@hig/theme-context";

function stylesheet({ variant }, theme) {
  const defaults = {
    fontFamily: theme["basics.fontFamilies.main"],
    color: theme["colorScheme.textColor"],
    fontSize: theme["density.fontSizes.medium"],
    margin: `0 0 ${theme["density.spacings.small"]} 0`,
    fontWeight: theme["basics.fontWeights.medium"]
  };

  if (variant === "h1") {
    return {
      ...defaults,
      fontSize: theme["density.fontSizes.extraLarge"],
      margin: `0 0 ${theme["density.spacings.medium"]} 0`
    };
  }
  if (variant === "h2") {
    return {
      ...defaults,
      fontSize: theme["density.fontSizes.large"],
      margin: `0 0 ${theme["density.spacings.medium"]} 0`
    };
  }
  return defaults;
}

function Text({ variant, children }) {
  return (
    <ThemeContext.Consumer>
      {({ resolvedRoles }) => (
        <p style={stylesheet({ variant }, resolvedRoles)}>{children}</p>
      )}
    </ThemeContext.Consumer>
  );
}

Text.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string
};

export default Text;
