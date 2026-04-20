const fs = require("fs");
const path = require("path");

const outputRoot = path.resolve(__dirname, "..", "tmp");

fs.rmSync(outputRoot, { recursive: true, force: true });
