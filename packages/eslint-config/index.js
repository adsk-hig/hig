module.exports = {
  extends: ["airbnb", "prettier", "prettier/react"],
  parser: "babel-eslint",
  settings: {
    "import/resolver": {
      "babel-module": {},
      webpack: true
    }
  },
  plugins: ["react", "prettier"],
  globals: {
    describe: true,
    it: true,
    expect: true,
    gemini: true,
    jest: true,
    beforeAll: true,
    beforeEach: true,
    afterEach: true,
    afterAll: true,
    document: true,
    window: true
  },
  rules: {
    "import/no-extraneous-dependencies": 0,
    "max-len": [1, { code: 100 }],
    "no-underscore-dangle": 0,
    "prettier/prettier": "error",
    "react/destructuring-assignment": 0,
    "react/jsx-filename-extension": 0,
    "react/no-danger": 2,
    "react/prefer-stateless-function": 0,
    "react/prop-types": 2,
    "react/require-default-props": 0,
    "react/style-prop-object": 0,
    /* Allow the use of <label /> without nesting the <input /> */
    "jsx-a11y/label-has-for": [
      2,
      {
        required: {
          every: ["id"]
        }
      }
    ]
  },
  overrides: [
    {
      files: ["*test.js", "**/__stories__/*.js"],
      rules: {
        "react/prop-types": 0
      }
    }
  ]
};
