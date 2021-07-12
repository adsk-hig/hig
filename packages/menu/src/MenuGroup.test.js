import React from "react";
import renderer from "react-test-renderer";
import MenuGroup from "./MenuGroup";
import Menu from "./Menu";
import Option from "./Option";

describe("menu/MenuGroup", () => {
  it("renders default Menu and Options", () => {
    const wrapper = (
      <MenuGroup>
        <Menu>
          <Option id="option-1">Option 1</Option>
          <Option id="option-2">Option 2</Option>
          <Option id="option-3">Option 3</Option>
        </Menu>
        <Menu>
          <Option id="option-4">Option 4</Option>
          <Option id="option-5">Option 5</Option>
          <Option id="option-6">Option 6</Option>
        </Menu>
        <Menu>
          <Option id="option-7">Option 7</Option>
          <Option id="option-8">Option 8</Option>
          <Option id="option-9">Option 9</Option>
        </Menu>
      </MenuGroup>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders mixed default and checkmark Menu and Options", () => {
    const wrapper = (
      <MenuGroup>
        <Menu checkmark>
          <Option id="option-1">Option 1</Option>
          <Option id="option-2">Option 2</Option>
          <Option id="option-3">Option 3</Option>
        </Menu>
        <Menu>
          <Option id="option-4">Option 4</Option>
          <Option id="option-5">Option 5</Option>
          <Option id="option-6">Option 6</Option>
        </Menu>
        <Menu checkmark>
          <Option id="option-7">Option 7</Option>
          <Option id="option-8">Option 8</Option>
          <Option id="option-9">Option 9</Option>
        </Menu>
      </MenuGroup>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders multiple and defaultSelected Menu and Options", () => {
    const wrapper = (
      <MenuGroup
        multiple
        defaultSelected={["option-3", "option-6", "option-9"]}
      >
        <Menu checkmark>
          <Option id="option-1">Option 1</Option>
          <Option id="option-2">Option 2</Option>
          <Option id="option-3">Option 3</Option>
        </Menu>
        <Menu>
          <Option id="option-4">Option 4</Option>
          <Option id="option-5">Option 5</Option>
          <Option id="option-6">Option 6</Option>
        </Menu>
        <Menu checkmark>
          <Option id="option-7">Option 7</Option>
          <Option id="option-8">Option 8</Option>
          <Option id="option-9">Option 9</Option>
        </Menu>
      </MenuGroup>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders multiple and controlled Menu and Options", () => {
    const wrapper = (
      <MenuGroup multiple selected={["option-3", "option-6", "option-9"]}>
        <Menu checkmark>
          <Option id="option-1">Option 1</Option>
          <Option id="option-2">Option 2</Option>
          <Option id="option-3">Option 3</Option>
        </Menu>
        <Menu>
          <Option id="option-4">Option 4</Option>
          <Option id="option-5">Option 5</Option>
          <Option id="option-6">Option 6</Option>
        </Menu>
        <Menu checkmark>
          <Option id="option-7">Option 7</Option>
          <Option id="option-8">Option 8</Option>
          <Option id="option-9">Option 9</Option>
        </Menu>
      </MenuGroup>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders Menus with dividers and Options", () => {
    const wrapper = (
      <MenuGroup>
        <Menu checkmark divider>
          <Option id="option-1">Option 1</Option>
          <Option id="option-2">Option 2</Option>
          <Option id="option-3">Option 3</Option>
        </Menu>
        <Menu divider>
          <Option id="option-4">Option 4</Option>
          <Option id="option-5">Option 5</Option>
          <Option id="option-6">Option 6</Option>
        </Menu>
        <Menu checkmark>
          <Option id="option-7">Option 7</Option>
          <Option id="option-8">Option 8</Option>
          <Option id="option-9">Option 9</Option>
        </Menu>
      </MenuGroup>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders Menus with checkmark and unselect", () => {
    const wrapper = (
      <MenuGroup>
        <Menu checkmark unselect={false}>
          <Option id="option-1">Option 1</Option>
          <Option id="option-2">Option 2</Option>
          <Option id="option-3">Option 3</Option>
        </Menu>
        <Menu divider>
          <Option id="option-4">Option 4</Option>
          <Option id="option-5">Option 5</Option>
          <Option id="option-6">Option 6</Option>
        </Menu>
        <Menu checkmark>
          <Option id="option-7">Option 7</Option>
          <Option id="option-8">Option 8</Option>
          <Option id="option-9">Option 9</Option>
        </Menu>
      </MenuGroup>
    );
    const tree = renderer.create(wrapper).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
