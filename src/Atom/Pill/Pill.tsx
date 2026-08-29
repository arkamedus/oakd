import React, { forwardRef } from "react";
import { sizeMinusOne } from "../../Core/Core.utils";
import { CoreIconNameType } from "../../Icon/Icons.bin";
import Icon from "../../Icon/Icon";
import Space from "../Space/Space";
import "./Pill.css";
import { PillProps } from "./Pill.types";

const Pill = forwardRef<HTMLSpanElement, PillProps>(
	(
		{
			variant = "ghost",
			size = "md",
			icon,
			wide,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const coreSize =
			size === "sm" ? "small" : size === "lg" ? "large" : "default";

		return (
			<span
				{...rest}
				ref={ref}
				className={[
					"oakd",
					"card",
					"standardized-reset",
					"standardized-text",
					"oakd-pill",
					`oakd-pill--${size}`,
					`type-${variant}`,
					`size-${coreSize}`,
					wide && "wide",
					className,
				]
					.filter(Boolean)
					.join(" ")}
			>
				<Space gap align="center" noWrap>
					{icon && typeof icon === "string" ? (
						<Icon
							name={icon as CoreIconNameType}
							size={sizeMinusOne(coreSize)}
						/>
					) : (
						icon
					)}
					{children}
				</Space>
			</span>
		);
	},
);
Pill.displayName = "Pill";
export default Pill;
