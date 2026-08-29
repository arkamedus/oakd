import React, { forwardRef } from "react";
import "./Badge.css";
import { BadgeProps } from "./Badge.types";
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	(
		{
			variant = "danger",
			hidden = false,
			label = "Notification",
			wide = false,
			className,
			children,
			...rest
		},
		ref,
	) => (
		<span
			{...rest}
			ref={ref}
			className={[
				"oakd",
				"standardized-reset",
				"oakd-badge",
				`type-${variant}`,
				wide && "wide",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{children}
			{hidden ? null : (
				<span
					className="oakd oakd-badge__dot"
					role={label ? "status" : undefined}
					aria-label={label || undefined}
					aria-hidden={label ? undefined : true}
				/>
			)}
		</span>
	),
);
Badge.displayName = "Badge";
export default Badge;
