import React from "react";
import renderer from "react-test-renderer";
import Menu from "./Menu";
import Option from "./Option";

describe("menu/Menu", () => {
  it("renders default Menu and Options", () => {
    const wrapper = (
      <Menu>
        <Option id="option-1">Option 1</Option>
        <Option id="option-2">Option 2</Option>
        <Option id="option-3">Option 3</Option>
      </Menu>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders checkmark indicator Menu and Options", () => {
    const wrapper = (
      <Menu checkmark>
        <Option id="option-1">Option 1</Option>
        <Option id="option-2">Option 2</Option>
        <Option id="option-3">Option 3</Option>
      </Menu>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders Menu and Options with defaultSelected", () => {
    const wrapper = (
      <Menu defaultSelected={["option-2"]}>
        <Option id="option-1">Option 1</Option>
        <Option id="option-2">Option 2</Option>
        <Option id="option-3">Option 3</Option>
      </Menu>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders Menu and Options with defaultSelected and checkmark variant", () => {
    const wrapper = (
      <Menu defaultSelected={["option-2"]} checkmark>
        <Option id="option-1">Option 1</Option>
        <Option id="option-2">Option 2</Option>
        <Option id="option-3">Option 3</Option>
      </Menu>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders Menu and Options with checkmark and unselect", () => {
    const wrapper = (
      <Menu defaultSelected={["option-2"]} unselect={false}>
        <Option id="option-1">Option 1</Option>
        <Option id="option-2">Option 2</Option>
        <Option id="option-3">Option 3</Option>
      </Menu>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
