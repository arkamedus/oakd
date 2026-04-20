const fs = require("fs");
const path = require("path");

const sourceRoot = path.resolve(__dirname, "..", "src");
const outputRoot = path.resolve(__dirname, "..", "tmp");
const assetExtensions = new Set([".css", ".svg"]);

function ensureDir(dirPath) {
	fs.mkdirSync(dirPath, { recursive: true });
}

function copyAssets(currentDir) {
	for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
		const sourcePath = path.join(currentDir, entry.name);
		const relativePath = path.relative(sourceRoot, sourcePath);
		const outputPath = path.join(outputRoot, relativePath);

		if (entry.isDirectory()) {
			copyAssets(sourcePath);
			continue;
		}

		if (!assetExtensions.has(path.extname(entry.name))) {
			continue;
		}

		ensureDir(path.dirname(outputPath));
		fs.copyFileSync(sourcePath, outputPath);
	}
}

ensureDir(outputRoot);
copyAssets(sourceRoot);
