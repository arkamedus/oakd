import React, { forwardRef } from "react";
import Content from "../Content/Content";
import "./Dock.css";
import { DockProps } from "./Dock.types";
const Dock = forwardRef<HTMLDivElement, DockProps>(
  (
    {
      position = "right",
      offset = "var(--oakd-leading)",
      className,
      style,
      ...rest
    },
    ref,
  ) => (
    <Content
      {...rest}
      ref={ref}
      className={["oakd-dock", `oakd-dock--${position}`, className]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ...style,
          "--oakd-dock-offset":
            typeof offset === "number" ? `${offset}px` : offset,
        } as React.CSSProperties
      }
    />
  ),
);
Dock.displayName = "Dock";
export default Dock;
