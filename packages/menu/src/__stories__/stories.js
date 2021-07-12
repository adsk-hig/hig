import React from "react";
import {
  AddMember24,
  AddFolder24,
  CartFull24,
  Cloud24,
  Checklist24
} from "@hig/icons";
import Avatar from "@hig/avatar";
import Menu, { Option } from "../index";

export default [
  {
    description: "default",
    getProps: () => ({
      multiple: false,
      checkmark: false,
      unselect: true,
      children: [
        <Option id="option-1" key="option-1">
          Option 1
        </Option>,
        <Option id="option-2" key="option-2">
          Option 2
        </Option>,
        <Option id="option-3" key="option-3" disabled>
          Option 3
        </Option>,
        <Option id="option-4" key="option-4">
          Option 4
        </Option>,
        <Option id="option-5" key="option-5">
          Option 5
        </Option>
      ]
    })
  },
  {
    description: "kitchen sink",
    getProps: () => ({
      checkmark: false,
      multiple: false,
      unselect: true,
      children: [
        <Menu id="shortcut-group" divider key="icon-group">
          <Option id="shortcut-header" role="presentation">
            Icon Option Header
          </Option>
          <Option
            id="add-folder"
            asset={<AddFolder24 />}
            shortcut={<span>&#8984; 5</span>}
          >
            Add Folder
          </Option>
          <Option
            id="add-member"
            asset={<AddMember24 />}
            shortcut={<span>&#8984; 6</span>}
          >
            Add Member
          </Option>
          <Option
            id="cart-full"
            asset={<CartFull24 />}
            shortcut={<span>&#8984; 7</span>}
          >
            Cart Full
          </Option>
          <Option
            id="cloud"
            asset={<Cloud24 />}
            shortcut={<span>&#8984; 8</span>}
          >
            Cloud
          </Option>
          <Option
            id="checklist"
            asset={<Checklist24 />}
            shortcut={<span>&#8984; 9</span>}
          >
            Checklist
          </Option>
        </Menu>,
        <Menu checkmark id="checkmark-group" divider key="checkmark-group">
          <Option id="checkmark-header" role="presentation">
            Checkmark Option Header
          </Option>
          <Option id="checkmark-1">Checkmark 1</Option>
          <Option id="checkmark-2">Checkmark 2</Option>
          <Option id="checkmark-3" disabled>
            Checkmark 3
          </Option>
          <Option id="checkmark-4">Checkmark 4</Option>
          <Option id="checkmark-5" disabled>
            Checkmark 5
          </Option>
        </Menu>,
        <Menu checkmark id="avatar-group" key="avatar-group">
          <Option id="avatar-header" role="presentation">
            Avatar Option Header
          </Option>
          <Option
            id="peter-parker"
            asset={<Avatar name="Peter Parker" size="medium" />}
          >
            Peter Parker
          </Option>
          <Option
            id="bruce-wayne"
            asset={<Avatar name="Bruce Wayne" size="medium" />}
          >
            Bruce Wayne
          </Option>
          <Option
            id="jessica-drew"
            asset={<Avatar name="Jessica Drew" size="medium" />}
          >
            Jessica Drew
          </Option>
          <Option
            id="cassandra-cain"
            asset={<Avatar name="Cassandra Cain" size="medium" />}
          >
            Cassandra Cain
          </Option>
          <Option
            id="stephanie-brown"
            asset={<Avatar name="Stephanie Brown" size="medium" />}
          >
            Stephanie Brown
          </Option>
        </Menu>
      ]
    })
  }
];
