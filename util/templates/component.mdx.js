module.exports = (componentName) => ({
    content: `import {Controls, Meta, Primary, Stories, Title} from "@storybook/blocks";
import meta from './${componentName}.stories';

<Meta of={meta} />

<Title />
The \`${componentName}\` component etc...

<Primary />

<Controls />

---

# ${componentName} Component

## Stories

Listed below are additional variations of the component.

<Stories />`,
    extension: `.mdx`
});