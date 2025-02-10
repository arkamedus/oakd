import React, { ReactNode } from "react";
import { IconProps } from "./Icon.types";

import "./Icon.css";
import { IconMap } from "./icons.generated";

const Icon: React.FC<IconProps> = ({
  name,
  style,
  size = "default",
  className = "",
  ...props
}) => {
  const IconSrc = IconMap[name];
  if (!IconSrc) {
    console.warn(`Icon "${name}" not found.`);
    return null;
  }
  // Extract URL string from the import (handles default export if present)
  const iconUrl = typeof IconSrc === "string" ? IconSrc : "X" || IconSrc;
  const iconStyle = {
    ...style,
    backgroundColor: style?.color || "currentColor",
    mask: `url(${iconUrl}) no-repeat center/contain`,
    WebkitMask: `url(${iconUrl}) no-repeat center/contain`,
  };

  return (
    <span
      className={`oakd icon icon-${size} ${className}`}
      style={iconStyle}
      {...props}
    />
  );
};

export default Icon;

interface IconStackProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const IconStack: React.FC<IconStackProps> = ({
  children,
  className = "",
  style,
}) => (
  <span className={`oakd-icon-stack ${className}`} style={style}>
    {React.Children.map(children, (child) => (
      <span className="oakd-icon-stack__item">{child}</span>
    ))}
  </span>
);