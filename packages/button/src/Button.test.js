import React from "react";
import { mount } from "enzyme";
import { takeSnapshotsOf } from "@hig/jest-preset/helpers";
import Button from "./Button";

describe("Button", () => {
  const subject = (props = {}) => mount(<Button title="Button" {...props} />);
  let wrapper;

  takeSnapshotsOf(Button, [
    {
      description: "renders as default button",
      props: { title: "Settings" }
    },
    {
      description: "renders as button type solid",
      props: { title: "Settings", type: "solid" }
    },
    {
      description: "renders as button type outline",
      props: { title: "Settings", type: "outline" }
    },
    {
      description: "renders as button type flat",
      props: { title: "Settings", type: "flat" }
    },
    {
      description: "renders with an icon",
      props: { icon: "<Icon />", title: "Settings" }
    },
    {
      description: "renders with className prop",
      props: { title: "Button Class", className: "custom-class" }
    },
    {
      description: "renders with a link",
      props: { link: "https://hig.autodesk.com", title: "Settings" }
    }
  ]);

  describe("event handlers", () => {
    let eventHandler;

    describe("onBlur", () => {
      beforeEach(() => {
        eventHandler = jest.fn();
        wrapper = subject({ onBlur: eventHandler });
      });

      it("is triggered on blur", () => {
        wrapper.simulate("blur");
        expect(eventHandler).toBeCalled();
      });
    });

    describe("onClick", () => {
      beforeEach(() => {
        eventHandler = jest.fn();
        wrapper = subject({ onClick: eventHandler });
      });

      it("is triggered on click", () => {
        wrapper.simulate("click");
        expect(eventHandler).toBeCalled();
      });
    });

    describe("onFocus", () => {
      beforeEach(() => {
        eventHandler = jest.fn();
        wrapper = subject({ onFocus: eventHandler });
      });

      it("is triggered on focus", () => {
        wrapper.simulate("focus");
        expect(eventHandler).toBeCalled();
      });
    });

    describe("onHover", () => {
      beforeEach(() => {
        eventHandler = jest.fn();
        wrapper = subject({ onHover: eventHandler });
      });

      it("is triggered on mouseover", () => {
        wrapper.simulate("mouseover");
        expect(eventHandler).toBeCalled();
      });
    });

    describe("onMouseEnter", () => {
      beforeEach(() => {
        eventHandler = jest.fn();
        wrapper = subject({ onMouseEnter: eventHandler });
      });

      it("is triggered on mouse enter", () => {
        wrapper.simulate("mouseenter");
        expect(eventHandler).toBeCalled();
      });
    });

    describe("onMouseLeave", () => {
      beforeEach(() => {
        eventHandler = jest.fn();
        wrapper = subject({ onMouseLeave: eventHandler });
      });

      it("is triggered on mouse leave", () => {
        wrapper.simulate("mouseleave");
        expect(eventHandler).toBeCalled();
      });
    });
  });

  describe("the element rendered", () => {
    let link;
    describe("given a link", () => {
      beforeEach(() => {
        link = "https://www.autodesk.com";
        wrapper = subject({ link });
      });

      it("is an <a> tag", () => {
        expect(wrapper.matchesElement(<a href={link}>Button</a>));
      });
    });

    describe("without a link", () => {
      beforeEach(() => {
        wrapper = subject();
      });

      it("is a <button> tag", () => {
        // eslint-disable-next-line react/button-has-type
        expect(wrapper.matchesElement(<button>Button</button>));
      });
    });
  });

  describe("when a disabled link", () => {
    const link = "https://www.autodesk.com";

    beforeEach(() => {
      wrapper = subject({ link, disabled: true });
    });

    it("is not tabbable", () => {
      expect(
        wrapper.matchesElement(
          <a href={link} tabIndex="-1">
            Button
          </a>
        )
      );
    });
  });
});
