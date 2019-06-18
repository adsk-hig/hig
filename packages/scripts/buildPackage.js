/** @todo Refactor this module to not have side effects */

const path = require("path");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const postcss = require("rollup-plugin-postcss");
const json = require("rollup-plugin-json");
const postcssFunctions = require("postcss-functions");
const postcssImport = require("postcss-import");
const svgr = require("@svgr/rollup");
const createBuildPreset = require("@hig/babel-preset/build");

const createExternalDeterminer = require("./createExternalDeterminer");

/* eslint-disable-next-line import/no-dynamic-require */
const packageMeta = require(path.resolve(process.cwd(), "package.json"));

const {
  name: packageName,
  version: packageVersion,
  peerDependencies = {},
  dependencies = {},
  main: mainOutputFile = "build/index.js",
  module: esOutputFile = "build/index.es.js",
  css: cssOutputFile = "build/index.css"
} = packageMeta;

const externalDependencies = Object.keys(peerDependencies).concat(
  Object.keys(dependencies)
);

const inputOptions = {
  input: "src/index.js",
  external: createExternalDeterminer(externalDependencies),
  plugins: [
    nodeResolve(),
    svgr.default(),
    postcss({
      extract: true,
      output: cssOutputFile,
      plugins: [postcssFunctions, postcssImport],
      sourceMap: true
    }),
    json(),
    babel({
      babelrc: false,
      ...createBuildPreset()
    }),
    commonjs()
  ]
};

const esModulesOutputOptions = {
  name: "HIG",
  file: esOutputFile,
  format: "esm"
};

const cjsOutputOptions = {
  file: mainOutputFile,
  format: "cjs",
  exports: "named"
};

module.exports = async function buildPackage() {
  /* eslint-disable-next-line no-console */
  console.log(`Bundling ${packageName} v${packageVersion}.`);

  const bundle = await rollup.rollup(inputOptions);

  return Promise.all([
    bundle.write(esModulesOutputOptions),
    bundle.write(cjsOutputOptions)
  ]);
};
