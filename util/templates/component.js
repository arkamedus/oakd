module.exports = (componentName) => ({
  content: `import React from "react";
import { ${componentName}Props } from "./${componentName}.types";
import "./${componentName}.css";

const ${componentName}: React.FC<${componentName}Props> = ({ children }) => (
  <div data-testid="${componentName}" className="oakd ${componentName.toLowerCase()}">{children}</div>
);

export default ${componentName};`,
  extension: `.tsx`
});
