import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ScriptSandbox from "./ScriptSandbox";
import { ScriptSandboxError, ScriptSandboxProps } from "./ScriptSandbox.types";
import CodeArea from "../CodeArea/CodeArea";
import {IconBug} from "../../Icon/Icons.bin";

const meta: Meta<typeof ScriptSandbox> = {
  title: "Design System/Atomic/ScriptSandbox",
  component: ScriptSandbox,
  args: {
    controls: true,
    autoRun: false,
    title: "Sandbox",
    initialBackground: "#ffffff",
  },
};
export default meta;

type Story = StoryObj<typeof ScriptSandbox>;

/* ------------------------------------------------------------------ */
/* Scripts                                                            */
/* ------------------------------------------------------------------ */

const okScript = `
// try oakframe built-ins
background("#edb");
print("Hello from sandbox!");
console.log("console.log also prints");
`;

const logicScript = `
print("Logic test");

function add(a, b) {
  return a + b;
}

for (let i = 0; i < 3; i++) {
  print("i =", i, "sum =", add(i, i + 1));
}

print("Done");
`;

const promiseScript = `
print("Promise test");

Promise.resolve(42).then(v => {
  print("Resolved value:", v);
});

print("After promise");
`;

const errorScript = `
print("This should print!");
const x = doesNotExist + 1;
print("Never reached!", x);
`;

const fetchScript = `
print("Attempting fetch...");
fetch("https://example.com")
  .then(r => r.text())
  .then(t => print("fetch result"+ t))
  .catch(t => print("finally result"+ t))
;
`;

const documentScript = `
print("document.location:");
console.log(document.location);

print("document keys:");
console.log(Object.keys(document));

print("window keys:");
console.log(Object.keys(window));
`;


/* ------------------------------------------------------------------ */
/* Helper wrapper used by each story                                   */
/* ------------------------------------------------------------------ */

function SandboxWithEditor(args: ScriptSandboxProps & { src: string }) {
  const [src, setSrc] = useState(args.src);
  const [lastErr, setLastErr] = useState<ScriptSandboxError | null>(null);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <ScriptSandbox
        {...args}
        src={src}
        onError={(e) => setLastErr(e)}
      />

      <CodeArea
        defaultValue={src}
        lineNumbers
        errorLines={[lastErr?.line ?? -1]}
        onChange={(e: any) => {
          setSrc(e.target.value);
          setLastErr(null);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stories (ONE SCRIPT = ONE STORY)                                    */
/* ------------------------------------------------------------------ */

export const OK_Basic: Story = {
  render: (args) => <SandboxWithEditor {...args} src={okScript} />,
};

export const OK_Logic: Story = {
  render: (args) => <SandboxWithEditor {...args} src={logicScript} />,
};

export const OK_Promise: Story = {
  render: (args) => <SandboxWithEditor {...args} src={promiseScript} />,
};

export const Error_Reference: Story = {
  render: (args) => <SandboxWithEditor {...args} src={errorScript} />,
};

export const Error_FetchBlocked: Story = {
  render: (args) => <SandboxWithEditor {...args} src={fetchScript} />,
};

export const Security_DocumentAccess: Story = {
  render: (args) => <SandboxWithEditor {...args} src={documentScript} />,
};

export const NoControls: Story = {
  args: {
    controls: false,
    autoRun: false,
    src: okScript,
  },
};
