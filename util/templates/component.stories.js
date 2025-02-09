module.exports = (componentName) => ({
  content: `import React from "react";
import {Meta} from "@storybook/react";
import ${componentName} from "./${componentName}";

const meta: Meta<typeof ${componentName}> = {
  title: "${componentName}",
  component: ${componentName},
  argTypes: { /* ... */ }
};
export default meta;

export const Default = () => <${componentName} />;

export const WithBaz = () => <${componentName} foo="baz" />;
`,
  extension: `.stories.tsx`
});
