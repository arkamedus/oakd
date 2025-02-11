import React, { memo } from "react";
import { BreadcrumbProps } from "./Breadcrumb.types";
import Icon from "../../Icon/Icon";
import "./Breadcrumb.css";
import Space from "../Space/Space";

const Breadcrumb: React.FC<BreadcrumbProps> = ({
	items,
	separator = "dot",
	className = "",
}) => {
	const renderSeparator = () => {
		switch (separator) {
			case "dot":
				return (
					<Icon
						name="Circle"
						size="small"
						className="oakd-breadcrumb__separator"
						data-testid="breadcrumb-separator"
					/>
				);
			case "slash":
				return (
					<Icon
						name="X"
						size="small"
						className="oakd-breadcrumb__separator"
						data-testid="breadcrumb-separator"
					/>
				);
			case "backslash":
				return (
					<Icon
						name="Trash"
						size="small"
						className="oakd-breadcrumb__separator"
						aria-hidden="true"
						data-testid="breadcrumb-separator"
					/>
				);
			default:
				return (
					<Icon
						name="Angle"
						size="small"
						className="oakd-breadcrumb__separator"
						aria-hidden="true"
						data-testid="breadcrumb-separator"
					/>
				);
		}
	};

	return (
		<Space
			className={`oakd-breadcrumb ${className}`.trim()}
			gap
			data-testid="Breadcrumb"
		>
			{items.map((item, index) => (
				<React.Fragment key={index}>
					{index > 0 && renderSeparator()}
					{typeof item.text === "string" ? (
						item.href ? (
							<a
								href={item.href}
								className={`oakd-breadcrumb__item ${item.className || ""}`.trim()}
								aria-current={index === items.length - 1 ? "page" : undefined}
							>
								{item.text}
							</a>
						) : (
							<span
								className={`oakd-breadcrumb__item ${item.className || ""}`.trim()}
							>
								{item.text}
							</span>
						)
					) : (
						item.text
					)}
				</React.Fragment>
			))}
		</Space>
	);
};

export default Breadcrumb;
