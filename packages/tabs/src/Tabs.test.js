import React from "react";
import renderer from "react-test-renderer";

import Tab from "./Tab";
import Tabs from "./Tabs";
import { alignments } from "./alignments";

describe("tabs/Tabs", () => {
  it("renders tabs", () => {
    const wrapper = (
      <Tabs align={alignments.RIGHT}>
        <Tab label="foo" onClick={() => {}}>
          bar
        </Tab>
        <Tab label="hello" active>
          world
        </Tab>
        <Tab
          label="boom"
          render={({ key }) => <button key={key} type="button" />}
        >
          bang
        </Tab>
      </Tabs>
    );
    const tree = renderer.create(wrapper).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
