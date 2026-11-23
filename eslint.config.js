export default [
  {
    files: ["src/scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
];
