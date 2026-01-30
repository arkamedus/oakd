import React from "react";
import {Meta} from "@storybook/react";
import CodeArea from "./CodeArea";

const meta: Meta<typeof CodeArea> = {
  title: "Design System/Atomic/CodeArea",
  component: CodeArea,
  argTypes: { /* ... */ }
};
export default meta;

export const Default = () => <CodeArea errorLines={[2, 5]} grow/>;
export const WithCode = () => <CodeArea defaultValue={`// Simple math
const count = 5;
let total = 0;

for (let i = 0; i < count; i++) {
  total += Math.pow(i, 2);
}

console.log("Total:", total);`} grow/>;

export const WithCodeAndError = () => <CodeArea highlightCurrentLine lineNumbers errorLines={[5]} defaultValue={`function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a /q b;
}

console.log(divide(10, 2));`} grow/>;
export const Disabled = () => <CodeArea disabled grow/>;
export const ReadOnly = () => <CodeArea readOnly grow value={"This should be read only!"}/>;

export const WithFeaturesAndErrorLines = () => <CodeArea
  defaultValue={"baz\nbar\nbuzz\nbiz\nbap"}
  lineNumbers
  highlightCurrentLine
  errorLines={[2, 5]}
  codeType="default"
  size="default"
  grow
/>

