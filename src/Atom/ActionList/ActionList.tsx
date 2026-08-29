import React, { forwardRef } from "react";
import Content from "../../Layout/Content/Content";
import Space from "../Space/Space";
import "./ActionList.css";
import { ActionListItemProps, ActionListProps } from "./ActionList.types";
const ActionList = forwardRef<HTMLDivElement, ActionListProps>(
	({ divided = true, className, ...rest }, ref) => (
		<Content
			{...rest}
			ref={ref}
			role={rest.role || "list"}
			className={[
				"oakd-action-list",
				divided && "oakd-action-list--divided",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		/>
	),
);
ActionList.displayName = "ActionList";
export const ActionListItem = forwardRef<HTMLDivElement, ActionListItemProps>(
	(
		{
			leading,
			title,
			description,
			trailing,
			disabled,
			onClick,
			className,
			...rest
		},
		ref,
	) => (
		<Content
			{...rest}
			ref={ref}
			role={rest.role || (onClick ? "button" : "listitem")}
			tabIndex={onClick && !disabled ? 0 : undefined}
			aria-disabled={disabled || undefined}
			className={[
				"oakd-action-list__item",
				onClick && "oakd-action-list__item--interactive",
				disabled && "oakd-action-list__item--disabled",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			onClick={disabled ? undefined : onClick}
			onKeyDown={(event) => {
				if (
					onClick &&
					!disabled &&
					(event.key === "Enter" || event.key === " ")
				) {
					event.preventDefault();
					onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
				}
				rest.onKeyDown?.(event);
			}}
		>
			<Space align="center" gap wide noWrap>
				{leading ? (
					<Content className="oakd-action-list__leading">{leading}</Content>
				) : null}
				<Content className="oakd-action-list__copy" grow>
					<Content className="oakd-action-list__title">{title}</Content>
					{description ? (
						<Content className="oakd-action-list__description">
							{description}
						</Content>
					) : null}
				</Content>
				{trailing ? (
					<Content className="oakd-action-list__trailing">{trailing}</Content>
				) : null}
			</Space>
		</Content>
	),
);
ActionListItem.displayName = "ActionListItem";
export default ActionList;
