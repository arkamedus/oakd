import React from "react";
import { AnnouncementProps } from "./Announcement.types";
import "./Announcement.css";
import Icon from "../../Icon/Icon";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";
import Content from "../../Layout/Content/Content";
import Space from "../Space/Space";
import { IconX } from "../../Icon/Icons.bin";

const Announcement: React.FC<AnnouncementProps> = ({
	children,
	variant = "default",
	closable = false,
	onClose,
	icon,
	wide,
	className = "",
	style,
	...rest
}) => {
	const classes = [
		"oakd",
		"announcement",
		`type-${variant}`,
		wide ? "wide" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Content
			{...rest}
			data-testid="Announcement"
			className={classes}
			style={style}
			role="region"
			wide={wide}
		>
			<Space className="announcement__body" align="center" gap wide noWrap>
				{icon ? (
					<Content className="announcement__icon">
						{typeof icon === "string" ? <Icon name={icon as any} /> : icon}
					</Content>
				) : null}
				<Content className="announcement__content" grow>
					{typeof children === "string" ? (
						<Paragraph>{children}</Paragraph>
					) : (
						children
					)}
				</Content>
				{closable ? (
					<Content
						className="announcement__close"
						aria-label="Close announcement"
						onClick={() => onClose?.()}
					>
						<IconX size={"small"} />
					</Content>
				) : null}
			</Space>
		</Content>
	);
};

export default Announcement;
