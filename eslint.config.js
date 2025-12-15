import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // Global ignores
  {
      ignores: ["public/build/**", "node_modules/**", "eslint.config.js", "vite.config.ts"]
  },

  // Base ESLint recommended config
  eslintJs.configs.recommended,

  // TypeScript recommended configs (this is an array)
  ...tseslint.configs.recommended,

  // React recommended config
  eslintReact.configs["recommended-typescript"],

  // Custom configuration for my project files
  {
    files: ["resources/ts/**/*.ts", "resources/ts/**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        browser: true,
        es2021: true,
      }
    },
    rules: {
      "@eslint-react/no-missing-key": "warn",
      "@eslint-react/dom/no-unsafe-target-blank": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
];
