module.exports = (componentName) => ({
  content: `import React from "react";
import ${componentName} from "./${componentName}";

const meta: Meta<typeof ${componentName}> = {
  title: "${componentName}",
  component: ${componentName},
  tags:['!autodocs'],
  argTypes: { /* ... */ }
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default = () => <${componentName} />;

export const WithBaz = () => <${componentName} foo="baz" />;
`,
  extension: `.stories.tsx`
});
