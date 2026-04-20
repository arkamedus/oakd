import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";
import copy from "rollup-plugin-copy";

const packageJson = require("./package.json");

export default {
  input: "tmp/index.js",
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
    resolve({ browser: true, extensions: [".mjs", ".js", ".jsx", ".json", ".node"] }),
    commonjs(),
    // Inline all SVG files as data URIs
    url({
      include: ["**/*.svg"],
      limit: Infinity,
    }),
    postcss(), // dont extract unless you are planning on having other libs import css
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
