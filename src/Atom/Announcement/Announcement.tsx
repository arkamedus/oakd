import React from "react";
import { AnnouncementProps } from "./Announcement.types";
import "./Announcement.css";
import Icon from "../../Icon/Icon";
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
	leading,
	action,
	fullHeightLeading = false,
	wide,
	className = "",
	style,
	...rest
}) => {
	const classes = [
		"oakd",
		"announcement",
		"oakd-announcement",
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
			<Space className="oakd-announcement__body" align="center" gap wide noWrap>
				{leading || icon ? (
					<Content
						className={[
							"oakd-announcement__leading",
							fullHeightLeading && "oakd-announcement__leading--full",
						]
							.filter(Boolean)
							.join(" ")}
					>
						{leading ??
							(typeof icon === "string" ? (
								<Icon name={icon as any} size="small" />
							) : (
								icon
							))}
					</Content>
				) : null}
				<Content className="oakd-announcement__content" grow>
					{typeof children === "string" ? (
						<Paragraph>{children}</Paragraph>
					) : (
						children
					)}
				</Content>
				{action ? (
					<Content className="oakd-announcement__action">{action}</Content>
				) : null}
				{closable ? (
					<Content
						className="oakd-announcement__close"
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
