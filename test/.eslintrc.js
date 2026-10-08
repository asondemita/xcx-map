module.exports = {
  root: true,
  plugins: ["jest"],
  extends: ["plugin:jest/recommended"],
  env: {
    browser: true,
    es2017: true,
    "jest/globals": true,
  },
  parserOptions: {
    sourceType: "module",
  },
};
