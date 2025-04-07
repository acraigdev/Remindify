// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "eslint:recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["/dist/*", "node_modules"],
  rules: {
    "no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-redeclare": "off",
    "@typescript-eslint/no-redeclare": "off",
    "react/display-name": "off",
  },
};
