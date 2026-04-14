import React from "react";
import { BreadcrumbProps } from "./Breadcrumb.types";
import Icon from "../../Icon/Icon";
import "./Breadcrumb.css";

const Breadcrumb: React.FC<BreadcrumbProps> = ({
	items,
	separator = "default",
	className = "",
	...rest
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
						name="Play"
						size="small"
						className="oakd-breadcrumb__separator"
						data-testid="breadcrumb-separator"
					/>
				);
			case "backslash":
				return (
					<Icon
						name="Diamond"
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
		<nav
			{...rest}
			className={`oakd-breadcrumb ${className}`.trim()}
			aria-label="Breadcrumb"
			data-testid="Breadcrumb"
		>
			<ol className="oakd-breadcrumb__list">
				{items.map((item, index) => {
					const content = item.href ? (
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
							aria-current={index === items.length - 1 ? "page" : undefined}
						>
							{item.text}
						</span>
					);

					return (
						<li className="oakd-breadcrumb__listItem" key={`${index}`}>
							{index > 0 && (
								<span
									className="oakd-breadcrumb__separatorWrap"
									aria-hidden="true"
								>
									{renderSeparator()}
								</span>
							)}
							{content}
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default Breadcrumb;
