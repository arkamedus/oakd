const js = require("@eslint/js");
const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const react = require("eslint-plugin-react");
const globals = require("globals");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        ignores: ["**/*.test.tsx"],
        languageOptions: {
            parser: tsParser,
            sourceType: "module",
            ecmaVersion: "latest",
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        plugins: {
            "@typescript-eslint": ts,
            react,
            prettier: prettierPlugin
        },
        rules: {
            "no-undef": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "react/react-in-jsx-scope": "off",
            "prettier/prettier": ["error", { useTabs: true }]
        }
    },
    prettier
];