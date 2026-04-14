import React, { useMemo, useState } from "react";
import { Meta } from "@storybook/react";
import CodeArea from "./CodeArea";
import { CodeAreaTokenRule } from "./CodeArea.types";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Title from "../Title/Title";
import Card from "../Card/Card";
import Select from "../Select/Select";

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
		rules: [
			{ className: "tok-comment", regex: /\/\*[\s\S]*?\*\//g },
			{ className: "tok-comment", regex: /\/\/.*$/gm },
			{ className: "tok-string", regex: /(["'`])(?:\\.|(?!\1)[^\\])*\1/g },
			{ className: "tok-number", regex: /\b\d+(\.\d+)?\b/g },
			{
				className: "tok-keyword",
				regex: /\b(type|export|function|return|const|let|if|else)\b/g,
			},
			{
				className: "tok-type",
				regex: /\b(string|boolean|WorkspaceSummary)\b/g,
			},
			{ className: "tok-boolean", regex: /\b(true|false)\b/g },
		],
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
		rules: [
			{ className: "tok-comment", regex: /#.*$/gm },
			{ className: "tok-string", regex: /(["'])(?:\\.|(?!\1)[^\\])*\1/g },
			{
				className: "tok-keyword",
				regex: /\b(if|then|fi|set)\b/g,
			},
			{
				className: "tok-builtin",
				regex: /\b(echo|tar)\b/g,
			},
		],
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
		rules: [
			{ className: "tok-string", regex: /(["'])(?:\\.|(?!\1)[^\\])*\1/g },
			{
				className: "tok-keyword",
				regex: /\b(package|import|type|struct|func|return)\b/g,
			},
			{
				className: "tok-type",
				regex: /\b(string|bool)\b/g,
			},
			{
				className: "tok-builtin",
				regex: /\b(fmt|Println)\b/g,
			},
			{ className: "tok-boolean", regex: /\b(true|false)\b/g },
		],
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
		rules: [
			{ className: "tok-string", regex: /(["'])(?:\\.|(?!\1)[^\\])*\1/g },
			{
				className: "tok-keyword",
				regex: /\b(program|implicit|none|integer|real|do|end|print)\b/gi,
			},
			{ className: "tok-number", regex: /\b\d+(\.\d+)?\b/g },
		],
	},
	css: {
		label: "CSS",
		code: `.workspace-panel {
  display: grid;
  gap: var(--leading);
  background: var(--background);
}

.workspace-panel__title {
  color: var(--font-color);
  font-size: calc(var(--font-size) * 1.2);
}`,
		rules: [
			{ className: "tok-comment", regex: /\/\*[\s\S]*?\*\//g },
			{ className: "tok-string", regex: /(["'])(?:\\.|(?!\1)[^\\])*\1/g },
			{
				className: "tok-builtin",
				regex: /(^|\s)(\.[A-Za-z_-][\w-]*)\b/gm,
			},
			{
				className: "tok-keyword",
				regex: /\b(display|gap|background|color|font-size)\b(?=\s*:)/g,
			},
			{
				className: "tok-type",
				regex: /\b(grid)\b/g,
			},
			{
				className: "tok-builtin",
				regex: /\b(var|calc)\b(?=\()/g,
			},
			{
				className: "tok-type",
				regex: /--[A-Za-z_-][\w-]*/g,
			},
			{ className: "tok-number", regex: /\b\d+(\.\d+)?\b/g },
		],
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
		codeType="default"
		size="default"
		grow
	/>
);

export const WithLanguageSelect = () => {
	const [language, setLanguage] = useState("typescript");
	const currentConfig = useMemo(() => languageConfig[language], [language]);

	return (
		<Card pad wide style={{ maxWidth: 960 }}>
			<Space direction="vertical" gap>
				<Space justify="between" align="center" wide>
					<Space direction="vertical">
						<Title>Language-aware editor preview</Title>
						<Paragraph>
							Switch the sample language to preview different code snippets and
							token rules.
						</Paragraph>
					</Space>
					<Select
						defaultValue={language}
						onChange={(value) => setLanguage(value)}
						options={Object.entries(languageConfig).map(([value, config]) => ({
							value,
							element: (
								<Paragraph>
									<strong>{config.label}</strong>
								</Paragraph>
							),
						}))}
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
	);
};
