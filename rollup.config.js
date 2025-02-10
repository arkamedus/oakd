import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";
import copy from "rollup-plugin-copy";

const packageJson = require("./package.json");

export default {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ browser: true }),
    commonjs(),
    // Inline all SVG files as data URIs
    url({
      include: ["**/*.svg"],
      limit: Infinity,
    }),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
      modules: true, // Enables CSS Modules
      extract: true, // Extracts CSS to a separate file
    }),
    // Only copy non-inline assets (like index.css)
    copy({
      targets: [
        {
          src: "src/index.css",
          dest: "build",
          rename: "index.css"
        }
      ]
    })
  ],
  preserveEntrySignatures: "strict", // Ensures dynamic imports are preserved
};
