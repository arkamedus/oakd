import { CodeAreaTokenRule } from "./CodeArea.types";

function getDefaultJsRules(): CodeAreaTokenRule[] {
  const keywords =
    "break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield|async|await";
  const types = "string|number|boolean|any|unknown|never|void|null|undefined";
  const builtins = "console|window|document|JSON|Math|Date|Promise|Set|Map";

  return [
    { className: "tok-comment", regex: /\/\*[\s\S]*?\*\//g },
    { className: "tok-comment", regex: /\/\/.*$/gm },
    { className: "tok-string", regex: /(["'`])(?:\\.|(?!\1)[^\\])*\1/g },
    { className: "tok-number", regex: /\b\d+(\.\d+)?\b/g },
    { className: "tok-keyword", regex: new RegExp(`\\b(${keywords})\\b`, "g") },
    { className: "tok-type", regex: new RegExp(`\\b(${types})\\b`, "g") },
    { className: "tok-builtin", regex: new RegExp(`\\b(${builtins})\\b`, "g") },
    { className: "tok-boolean", regex: /\b(true|false)\b/g },
  ];
}

const languageRules: Record<string, CodeAreaTokenRule[]> = {
  javascript: getDefaultJsRules(),
  typescript: [
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
  bash: [
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
  go: [
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
  fortran: [
    { className: "tok-string", regex: /(["'])(?:\\.|(?!\1)[^\\])*\1/g },
    {
      className: "tok-keyword",
      regex: /\b(program|implicit|none|integer|real|do|end|print)\b/gi,
    },
    { className: "tok-number", regex: /\b\d+(\.\d+)?\b/g },
  ],
  css: [
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
  json: [
    { className: "tok-type", regex: /"(?:\\.|[^"\\])*"(?=\s*:)/g },
    { className: "tok-string", regex: /"(?:\\.|[^"\\])*"/g },
    { className: "tok-number", regex: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g },
    { className: "tok-boolean", regex: /\b(?:true|false|null)\b/g },
  ],
};
const aliases: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  sh: "bash",
  shell: "bash",
  golang: "go",
  f90: "fortran",
  f95: "fortran",
};
export function getCodeAreaRules(language: string): CodeAreaTokenRule[] {
  const name = language.trim().toLowerCase();
  const resolved = aliases[name] ?? name;
  return Object.prototype.hasOwnProperty.call(languageRules, resolved)
    ? languageRules[resolved]
    : [];
}
