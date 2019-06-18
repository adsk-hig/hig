import React from "react";
import RichText from "@hig/rich-text";

import DefaultExport from "../index";
import readme from "../../README.md";

console.log("avatar readme", readme);

export default {
  propTables: [DefaultExport],
  source: true,
  text: <RichText dangerouslySetInnerHTML={{ __html: readme }} />
};
