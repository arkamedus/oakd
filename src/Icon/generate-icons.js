// generate-icons.js
const fs = require("fs");
const path = require("path");

const assetDir = path.resolve(__dirname, "asset");
const outputFile = path.resolve(__dirname, "icons.generated.tsx");

fs.readdir(assetDir, (err, files) => {
    if (err) {
        console.error("Error reading asset directory:", err);
        process.exit(1);
    }
    const svgFiles = files.filter((file) => file.endsWith(".svg"));

    const importStatements = [];
    const iconMapEntries = [];
    const iconTypesArray = [];
    const exportStatements = [];

    svgFiles.forEach((file) => {
        // Example: file = "oakd_IconTrash.svg"
        const baseName = path.basename(file, ".svg"); // e.g., "oakd_IconTrash"
        // Remove "oakd_" prefix if present
        let iconName = baseName.startsWith("oakd_")
            ? baseName.substring("oakd_".length)
            : baseName;
        // Remove any "Icon" prefix if desired (optional)
        iconName = iconName.replace(/^Icon/, "");
        iconTypesArray.push(iconName);
        const importVar = `I${iconName}`;
        importStatements.push(`import ${importVar} from "./asset/${file}";`);
        iconMapEntries.push(`  "${iconName}": ${importVar}`);
        exportStatements.push(
            `export const Icon${iconName} = (props: Omit<IconProps, "name">) => <Icon name="${iconName}" {...props} />;`
        );
    });

    const fileContent = `// This file is auto-generated. Do not edit manually.
import React from "react";
import {CoreIconNameType, IconProps} from "./Icon.types";
import Icon from "./Icon";

${importStatements.join("\n")}

export const IconMap: Record<string, string> = {
${iconMapEntries.join(",\n")}
};
export type CoreIconNameType = ${iconTypesArray.map(a=>{return `"${a}"`}).join(" | ")};

export const IconTypes: CoreIconNameType[] = ${JSON.stringify(iconTypesArray)};

${exportStatements.join("\n")}
`;

    fs.writeFile(outputFile, fileContent, (err) => {
        if (err) {
            console.error("Error writing generated file:", err);
            process.exit(1);
        }
        console.log("Icons exported successfully in", outputFile);
    });
});
