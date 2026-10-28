import React from "react";

/** Read supplied text children without invoking or mounting components. */
export const getSearchText = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getSearchText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    const props = node.props as { children?: React.ReactNode; title?: React.ReactNode; description?: React.ReactNode };
    return [getSearchText(props.children), getSearchText(props.title), getSearchText(props.description)].filter(Boolean).join(" ");
  }
  return "";
};
