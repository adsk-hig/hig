function getRulesByPresentation(themeData) {
  return {
    fontSize: themeData[`menu.header.fontSize`],
    fontWeight: themeData[`menu.header.fontWeight`],
    color: themeData[`menu.header.fontColor`],
    opacity: 0.5,
    textTransform: `uppercase`,
    cursor: `default`,
    padding: `0 
        ${themeData["menu.item.paddingHorizontal"]}
        ${themeData["menu.header.marginBottom"]}`
  };
}

export default function stylesheet(props, themeData) {
  const {
    disabled,
    divider,
    highlighted,
    isPressed,
    role,
    selected,
    unselect,
    stylesheet: customStylesheet
  } = props;
  const styles = {
    menuGroup: {
      overflowY: `auto`,
      outline: 0
    },
    menu: {
      borderBottom: divider
        ? `1px solid ${themeData[`menu.divider.backgroundColor`]}`
        : {},
      boxSizing: `border-box`,
      cursor: `pointer`,
      fontFamily: themeData[`menu.fontFamily`],
      listStyle: `none`,
      margin: 0,
      outline: 0,
      padding: `${themeData["menu.container.paddingVertical"]} 0`,
      overflowY: `auto`
    },
    menuOption: {
      display: `flex`,
      color: themeData[`menu.label.fontColor`],
      fontSize: themeData[`menu.label.fontSize`],
      alignItems: `center`,
      minHeight: themeData[`menu.item.minHeight`],
      padding: `${themeData["menu.item.paddingVertical"]}
        ${themeData["menu.item.paddingHorizontal"]}`,
      transition: `background-color 0.3s cubic-bezier(0.4,0,0.2,1)`,
      ...(selected && !disabled
        ? { fontWeight: themeData[`menu.label.selected.fontWeight`] }
        : { fontWeight: themeData[`menu.label.default.fontWeight`] }),
      ...(highlighted && !disabled
        ? {
            backgroundColor: themeData[`menu.item.hover.backgroundColor`],
            transition: `background-color 0.3s cubic-bezier(0.4,0,0.2,1)`
          }
        : {}),
      ...(isPressed && (!disabled && role !== `presentation`)
        ? {
            backgroundColor: themeData[`menu.item.pressed.backgroundColor`],
            transition: `background-color 0.3s cubic-bezier(0.4,0,0.2,1)`
          }
        : {}),
      ...(isPressed && selected && !unselect
        ? {
            backgroundColor: themeData[`menu.item.hover.backgroundColor`]
          }
        : {}),
      ...(disabled
        ? {
            opacity: themeData[`colorScheme.opacity.disabled`],
            cursor: `not-allowed`
          }
        : {}),
      ...(role === `presentation` ? getRulesByPresentation(themeData) : {})
    },
    checkmarkWrapper: {
      display: `flex`,
      alignItems: `center`,
      position: `relative`,
      height: themeData[`menu.item.minHeight`],
      justifyContent: `center`,
      marginRight: themeData[`menu.item.paddingHorizontal`],
      "& > svg > *": {
        opacity: 0,
        transition: `opacity 0.3s cubic-bezier(0.4,0,0.2,1)`,
        ...(highlighted && !disabled
          ? {
              fill: themeData[`menu.item.checkmark.hover.iconColor`],
              opacity: 1,
              transition: `opacity 0.3s cubic-bezier(0.4,0,0.2,1)`
            }
          : {}),
        ...(selected && !disabled
          ? {
              fill: themeData[`menu.item.checkmark.active.iconColor`],
              opacity: 1,
              transition: `opacity 0.3s cubic-bezier(0.4,0,0.2,1)`
            }
          : {})
      }
    },
    assetWrapper: {
      display: `flex`,
      justifyContent: `center`,
      marginRight: themeData[`menu.item.paddingHorizontal`],
      fontWeight: 400
    },
    optionContentWrapper: {
      display: `flex`,
      width: `100%`
    },
    shortcutWrapper: {
      color: themeData[`menu.shortcut.fontColor`],
      fontSize: themeData[`menu.shortcut.fontSize`],
      alignSelf: `center`,
      fontWeight: themeData[`menu.shortcut.fontWeight`],
      marginLeft: `auto`
    }
  };

  return customStylesheet ? customStylesheet(styles, props, themeData) : styles;
}
