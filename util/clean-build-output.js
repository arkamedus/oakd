const fs = require("fs");
const path = require("path");

const buildRoot = path.resolve(__dirname, "..", "build");
fs.rmSync(buildRoot, { recursive: true, force: true });
