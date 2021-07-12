import { Component } from "react";
import PropTypes from "prop-types";
import selectOption from "./selectOption";

function scrollInViewport(option) {
  const optionBounding = option.getBoundingClientRect();

  if (
    optionBounding.top < 0 ||
    optionBounding.bottom >
      (window.innerHeight || document.documentElement.clientHeight)
  ) {
    // align to the top if the top of Option is out of the viewport
    if (optionBounding.top < 0) {
      option.scrollIntoView(true);
    }
    // align to the bottom if the bottom of Option is out of the viewport
    if (
      optionBounding.bottom >
      (window.innerHeight || document.documentElement.clientHeight)
    ) {
      option.scrollIntoView(false);
    }
  }
}

function scrollInListbox(option, menu) {
  if (option && menu.scrollHeight > menu.clientHeight) {
    const scrollBottom = menu.clientHeight + menu.scrollTop;
    const elementBottom = option.offsetTop + option.offsetHeight;
    if (elementBottom > scrollBottom) {
      // eslint-disable-next-line no-param-reassign
      menu.scrollTop = elementBottom - menu.clientHeight;
    }
    if (option.offsetTop < menu.scrollTop) {
      // eslint-disable-next-line no-param-reassign
      menu.scrollTop = option.offsetTop;
    }
  }
}

function checkScroll(optionId, menu) {
  const option = document.getElementById(optionId);

  // scroll if out of viewport
  scrollInViewport(option);

  // scroll within the menu
  scrollInListbox(option, menu);
}

export default class MenuBehavior extends Component {
  static propTypes = {
    children: PropTypes.func,
    defaultSelected: PropTypes.arrayOf(PropTypes.any),
    getActiveOption: PropTypes.func,
    getHighlightIndex: PropTypes.func,
    getOptionsInfo: PropTypes.func,
    getPreviousEvent: PropTypes.func,
    handleBlur: PropTypes.func,
    handleFocus: PropTypes.func,
    handleKeyDown: PropTypes.func,
    handleMouseMove: PropTypes.func,
    menuRef: PropTypes.func,
    multiple: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    selected: PropTypes.arrayOf(PropTypes.any),
    setActiveOption: PropTypes.func,
    setHighlightIndex: PropTypes.func,
    setOptionsInfo: PropTypes.func,
    setPreviousEvent: PropTypes.func,
    unselect: PropTypes.bool
  };

  static defaultProps = {
    defaultSelected: []
  };

  constructor(props) {
    super(props);

    this.state = {
      activeOption: this.isControlled()
        ? this.props.selected
        : this.props.defaultSelected,
      highlightIndex: 0,
      optionInfo: null,
      previousEvent: null
    };

    this.menuRef = null;
  }

  setMenuRef = element => {
    if (this.props.menuRef) {
      this.props.menuRef(element);
    }

    this.menuRef = element;
  };

  setOptionsInfo = optionInfo => {
    this.setState({ optionInfo });
  };

  getOptionsInfo = () => this.state.optionInfo;

  setActiveOption = activeOption => {
    const { onChange, unselect } = this.props;
    if (onChange) {
      if (unselect) {
        this.props.onChange(activeOption);
        this.setState({ activeOption });
      } else {
        let newActiveOption;
        if (
          activeOption.length === 0 ||
          activeOption.length < this.state.activeOption.length
        ) {
          newActiveOption = this.state.activeOption;
          this.props.onChange(this.state.activeOption);
        } else {
          newActiveOption = activeOption;
          this.props.onChange(activeOption);
        }
        this.setState({ activeOption: newActiveOption });
      }
    }
  };

  getActiveOption = () => this.state.activeOption;

  setHighlightIndex = highlightIndex => {
    this.setState({ highlightIndex });
  };

  getHighlightIndex = () => this.state.highlightIndex;

  getPreviousEvent = () => this.state.previousEvent;

  setPreviousEvent = previousEvent => {
    this.setState({ previousEvent });
  };

  getTotalOptions = () => Object.keys(this.state.optionInfo).length;

  isControlled() {
    return this.props.selected !== undefined;
  }

  handleFocus = event => {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }

    event.stopPropagation();
  };

  handleBlur = event => {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }

    event.stopPropagation();
    this.setHighlightIndex(0);
  };

  handleKeyDown = event => {
    const {
      getHighlightIndex,
      getOptionsInfo,
      setActiveOption,
      setHighlightIndex,
      setPreviousEvent
    } = this;
    const { multiple, onKeyDown } = this.props;
    const options = this.state.optionInfo;
    const highlightableIndexes = [];

    if (onKeyDown) {
      onKeyDown(event);
    }

    Object.keys(options).forEach(index => {
      if (!options[index].disabled && options[index].role !== `presentation`) {
        highlightableIndexes.push(Number(index) + 1);
      }
    });

    setPreviousEvent(event.type);

    switch (event.keyCode) {
      // Arrow Down
      case 40: {
        const currentIndex = highlightableIndexes.indexOf(getHighlightIndex());
        const lastIndex = highlightableIndexes.length - 1;

        if (currentIndex === lastIndex) {
          setHighlightIndex(highlightableIndexes[0]);

          checkScroll(
            getOptionsInfo()[highlightableIndexes[0] - 1].id,
            this.menuRef
          );
        } else {
          setHighlightIndex(highlightableIndexes[currentIndex + 1]);

          checkScroll(
            getOptionsInfo()[highlightableIndexes[currentIndex + 1] - 1].id,
            this.menuRef
          );
        }
        event.preventDefault();
        break;
      }

      // Arrow Up
      case 38: {
        const currentIndex = highlightableIndexes.indexOf(getHighlightIndex());
        const lastIndex = highlightableIndexes.length - 1;

        if (currentIndex <= 0) {
          setHighlightIndex(highlightableIndexes[lastIndex]);

          checkScroll(
            getOptionsInfo()[highlightableIndexes[lastIndex] - 1].id,
            this.menuRef
          );
        } else {
          setHighlightIndex(highlightableIndexes[currentIndex - 1]);

          checkScroll(
            getOptionsInfo()[highlightableIndexes[currentIndex - 1] - 1].id,
            this.menuRef
          );
        }
        event.preventDefault();
        break;
      }

      // Enter
      // Space
      case 13:
      case 32: {
        const activeOptionsArray = [...this.state.activeOption];
        const { id } = this.state.optionInfo[getHighlightIndex() - 1];
        const activeOptions = selectOption(id, activeOptionsArray, multiple);

        if (this.isControlled()) {
          return;
        }

        setActiveOption(activeOptions);

        event.preventDefault();
        break;
      }

      default:
    }
  };

  handleMouseMove = event => {
    // don't let this bubble up from Menu to MenuGroup
    event.stopPropagation();

    if (this.getPreviousEvent() === event.type) {
      return;
    }

    this.setPreviousEvent(event.type);
  };

  render() {
    const getActiveOption = this.props.getActiveOption
      ? this.props.getActiveOption
      : this.getActiveOption;
    const getHighlightIndex = this.props.getHighlightIndex
      ? this.props.getHighlightIndex
      : this.getHighlightIndex;
    const getOptionsInfo = this.props.getOptionsInfo
      ? this.props.getOptionsInfo
      : this.getOptionsInfo;
    const getPreviousEvent = this.props.getPreviousEvent
      ? this.props.getPreviousEvent
      : this.getPreviousEvent;
    const handleBlur = this.props.handleBlur
      ? this.props.handleBlur
      : this.handleBlur;
    const handleFocus = this.props.handleFocus
      ? this.props.handleFocus
      : this.handleFocus;
    const handleKeyDown = this.props.handleKeyDown
      ? this.props.handleKeyDown
      : this.handleKeyDown;
    const handleMouseMove = this.props.handleMouseMove
      ? this.props.handleMouseMove
      : this.handleMouseMove;
    const setActiveOption = this.props.setActiveOption
      ? this.props.setActiveOption
      : this.setActiveOption;
    const setHighlightIndex = this.props.setHighlightIndex
      ? this.props.setHighlightIndex
      : this.setHighlightIndex;
    const setOptionsInfo = this.props.setOptionsInfo
      ? this.props.setOptionsInfo
      : this.setOptionsInfo;
    const setPreviousEvent = this.props.setPreviousEvent
      ? this.props.setPreviousEvent
      : this.setPreviousEvent;
    const { setMenuRef } = this;

    return this.props.children({
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
    });
  }
}
