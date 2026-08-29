import React, { forwardRef } from "react";
import Content from "../../Layout/Content/Content";
import Space from "../Space/Space";
import "./EmptyState.css";
import { EmptyStateProps } from "./EmptyState.types";
const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
	({ icon, title, description, actions, className, ...rest }, ref) => (
		<Content
			{...rest}
			ref={ref}
			className={["oakd-empty-state", className].filter(Boolean).join(" ")}
		>
			<Space direction="vertical" align="center" justify="center" gap wide>
				{icon ? (
					<Content className="oakd-empty-state__icon">{icon}</Content>
				) : null}
				<Content className="oakd-empty-state__title">{title}</Content>
				{description ? (
					<Content className="oakd-empty-state__description">
						{description}
					</Content>
				) : null}
				{actions ? (
					<Space className="oakd-empty-state__actions" justify="center" gap>
						{actions}
					</Space>
				) : null}
			</Space>
		</Content>
	),
);
EmptyState.displayName = "EmptyState";
export default EmptyState;
