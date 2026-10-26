import React, { useMemo, useState } from "react";
import { Meta } from "@storybook/react";
import CodeArea from "./CodeArea";
import { getCodeAreaRules } from "./CodeArea.rules";
import { CodeAreaTokenRule } from "./CodeArea.types";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Title from "../Title/Title";
import Card from "../Card/Card";
import Select from "../Select/Select";
import ContentRail from "../../Layout/ContentRail/ContentRail";

const meta: Meta<typeof CodeArea> = {
  title: "Design System/Atomic/CodeArea",
  component: CodeArea,
  argTypes: {
    /* ... */
  },
};
export default meta;

const languageConfig: Record<
  string,
  { label: string; code: string; rules: CodeAreaTokenRule[] }
> = {
  typescript: {
    label: "TypeScript",
    code: `type WorkspaceSummary = {
  id: string;
  owner: string;
  active: boolean;
};

export function formatWorkspace(workspace: WorkspaceSummary): string {
  return workspace.active
    ? \`\${workspace.owner} manages \${workspace.id}\`
    : "Workspace archived";
}`,
    rules: getCodeAreaRules("typescript"),
  },
  bash: {
    label: "Bash",
    code: `#!/usr/bin/env bash
set -euo pipefail

workspace="oakd"
echo "Deploying \${workspace}"

if [[ -d "build" ]]; then
  tar -czf build.tar.gz build
fi`,
    rules: getCodeAreaRules("bash"),
  },
  go: {
    label: "Go",
    code: `package main

import "fmt"

type release struct {
	Name string
	Ready bool
}

func main() {
	current := release{Name: "oakd", Ready: true}
	fmt.Println(current.Name, current.Ready)
}`,
    rules: getCodeAreaRules("go"),
  },
  fortran: {
    label: "FORTRAN",
    code: `program oakd_metrics
  implicit none
  integer :: idx
  real :: total

  total = 0.0
  do idx = 1, 3
    total = total + idx
  end do

  print *, "TOTAL =", total
end program oakd_metrics`,
    rules: getCodeAreaRules("fortran"),
  },
  css: {
    label: "CSS",
    code: `.workspace-panel {
  display: grid;
  gap: var(--oakd-leading);
  background: var(--oakd-background);
}

.workspace-panel__title {
  color: var(--oakd-font-color);
  font-size: calc(var(--oakd-font-size) * 1.2);
}`,
    rules: getCodeAreaRules("css"),
  },
};

export const Default = () => <CodeArea grow />;

export const WithCode = () => (
  <CodeArea
    defaultValue={`// Simple math
const count = 5;
let total = 0;

for (let i = 0; i < count; i++) {
  total += Math.pow(i, 2);
}

console.log("Total:", total);`}
    grow
  />
);

export const WithCodeAndError = () => (
  <CodeArea
    highlightCurrentLine
    lineNumbers
    errorLines={[5]}
    defaultValue={`function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a /q b;
}

console.log(divide(10, 2));`}
    grow
  />
);

export const Disabled = () => <CodeArea disabled grow />;

export const ReadOnly = () => (
  <CodeArea readOnly grow value={"This should be read only!"} />
);

export const WithFeaturesAndErrorLines = () => (
  <CodeArea
    defaultValue={"baz\nbar\nbuzz\nbiz\nbap"}
    lineNumbers
    highlightCurrentLine
    errorLines={[2, 5]}
    size="default"
    grow
  />
);

export const WithLanguageSelect = () => {
  const [language, setLanguage] = useState("typescript");
  const currentConfig = useMemo(() => languageConfig[language], [language]);

  return (
    <ContentRail size="large" gutter={false}>
      <Card pad wide>
        <Space direction="vertical" gap>
          <Space justify="between" align="center" wide>
            <Space direction="vertical">
              <Title>Language-aware editor</Title>
              <Paragraph>
                Switch the sample language to preview different code snippets
                and token rules.
              </Paragraph>
            </Space>
            <Select
              defaultValue={language}
              onChange={(value) => setLanguage(value)}
              options={Object.entries(languageConfig).map(
                ([value, config]) => ({
                  value,
                  element: (
                    <Paragraph>
                      <strong>{config.label}</strong>
                    </Paragraph>
                  ),
                }),
              )}
              placeholder={currentConfig.label}
              direction="bottom-right"
            />
          </Space>
          <CodeArea
            value={currentConfig.code}
            rules={currentConfig.rules}
            lineNumbers
            highlightCurrentLine
            grow
            readOnly
          />
        </Space>
      </Card>
    </ContentRail>
  );
};
