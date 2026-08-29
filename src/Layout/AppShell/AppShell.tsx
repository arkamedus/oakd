import React, { forwardRef } from "react";
import Content from "../Content/Content";
import Space from "../../Atom/Space/Space";
import "./AppShell.css";
import { AppShellProps } from "./AppShell.types";

const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
	(
		{
			header,
			sidebar,
			footer,
			sidebarMode = "expanded",
			sidebarWidth = "auto",
			collapsedSidebarWidth = "auto",
			children,
			className,
			style,
			...rest
		},
		ref,
	) => (
		<Content
			{...rest}
			ref={ref}
			className={["oakd-app-shell", className].filter(Boolean).join(" ")}
			style={
				{
					...style,
					"--oakd-app-shell-sidebar-width":
						typeof sidebarWidth === "number"
							? `${sidebarWidth}px`
							: sidebarWidth,
					"--oakd-app-shell-sidebar-collapsed-width":
						typeof collapsedSidebarWidth === "number"
							? `${collapsedSidebarWidth}px`
							: collapsedSidebarWidth,
				} as React.CSSProperties
			}
		>
			{header ? (
				<Content className="oakd-app-shell__header">{header}</Content>
			) : null}
			<Space
				className="oakd-app-shell__workspace"
				direction="horizontal"
				wide
				grow
				fill
				noWrap
			>
				{sidebar && sidebarMode !== "hidden" ? (
					<Content
						className={`oakd-app-shell__sidebar oakd-app-shell__sidebar--${sidebarMode}`}
						data-sidebar-mode={sidebarMode}
						fill
					>
						{sidebar}
					</Content>
				) : null}
				<Content className="oakd-app-shell__main" grow fill>
					{children}
				</Content>
			</Space>
			{footer ? (
				<Content className="oakd-app-shell__footer">{footer}</Content>
			) : null}
		</Content>
	),
);

AppShell.displayName = "AppShell";
export default AppShell;
