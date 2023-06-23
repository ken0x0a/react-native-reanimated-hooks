module.exports = {
  extends: [
    "@ken0x0a/eslint-config/base",
    "@ken0x0a/eslint-config/import",
    "@ken0x0a/eslint-config/typescript",
  ],
  rules: {
    "import/extensions": 0,
    curly: [2, "all"],
  },
};
