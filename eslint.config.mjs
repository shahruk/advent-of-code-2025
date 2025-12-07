import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores(["build/**", "node_modules/**", "coverage/**"]),
]);

export default eslintConfig;
