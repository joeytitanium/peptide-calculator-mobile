const expoConfig = require("eslint-config-expo/flat");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const noRelativeImportPaths = require("eslint-plugin-no-relative-import-paths");

module.exports = [
  ...expoConfig,
  {
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
    },
    rules: {
      // Your custom rules
      "no-void": ["error", { allowAsStatement: true }],
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { allowSameFolder: true, prefix: "@" },
      ],

      // Additional custom rules
      "consistent-return": "off",
      "import/extensions": "off",
      indent: "off",
      "react/no-unescaped-entities": "off",
      "import/order": "off",
      "no-plusplus": "off",
      "no-use-before-define": "off",
    },
  },
  {
    files: ["metro.config.cjs"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
];
