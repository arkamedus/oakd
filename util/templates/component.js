module.exports = (componentName) => ({
  content: `import React from "react";
import { ${componentName}Props } from "./${componentName}.types";
import "./${componentName}.css";

const ${componentName}: React.FC<${componentName}Props> = ({ foo }) => (
    <div data-testid="${componentName}" className="oakd ${componentName.toLowerCase()}">{foo}</div>
);

export default ${componentName};`,
  extension: `.tsx`
});
