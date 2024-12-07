import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/.eslintrc.cjs", "**/node_modules/", "**/dist/", "**/.eslintrc.cjs"],
}, ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: ["./tsconfig.json"],
            tsconfigRootDir: "C:\\_projects\\bcgov\\onroutebc-policy-engine",
        },
    },

    rules: {
        "@typescript-eslint/no-explicit-any": "off",
    },
    },
    {
    ignores: ["node_modules/*", "dist/*"]
}];