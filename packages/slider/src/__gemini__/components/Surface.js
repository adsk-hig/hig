import React from "react";
import PropTypes from "prop-types";
import ThemeContext from "@hig/theme-context";

function stylesheet({ level, paddingSize }, resolvedRoles) {
  return {
    backgroundColor: resolvedRoles[`colorScheme.surfaceLevel${level}Color`],
    marginBottom: resolvedRoles["density.spacings.large"],
    padding: paddingSize
      ? resolvedRoles[`density.spacings.${paddingSize}`]
      : undefined
  };
}

function Surface({
  level,
  children,
  paddingSize,
  style: styleProp,
  ...otherProps
}) {
  return (
    <ThemeContext.Consumer>
      {({ resolvedRoles }) => {
        const style = {
          ...stylesheet({ level, paddingSize }, resolvedRoles),
          ...styleProp
        };

        return (
          <div style={style} {...otherProps}>
            {children}
          </div>
        );
      }}
    </ThemeContext.Consumer>
  );
}

Surface.propTypes = {
  paddingSize: PropTypes.oneOf([
    "extraExtraSmall",
    "extraSmall",
    "small",
    "medium",
    "large",
    "extraLarge",
    "extraExtraLarge",
    "none"
  ]),
  level: PropTypes.oneOf(["100", "200", "250", "300", "350"]),
  children: PropTypes.node,
  style: PropTypes.objectOf(PropTypes.object())
};

Surface.defaultProps = {
  paddingSize: "large",
  level: "100"
};

export default Surface;
