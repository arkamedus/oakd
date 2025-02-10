const js = require("@eslint/js");
const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const react = require("eslint-plugin-react");

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
                window: "readonly",
                document: "readonly",
                HTMLImageElement: "readonly"
            }
        },
        plugins: {
            "@typescript-eslint": ts,
            react,
            prettier: prettierPlugin
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
            "react/react-in-jsx-scope": "off",
            "prettier/prettier": ["error", { useTabs: true }]
        }
    },
    prettier
];
