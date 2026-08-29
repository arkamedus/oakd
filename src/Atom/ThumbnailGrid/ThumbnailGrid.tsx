import React from "react";
import Content from "../../Layout/Content/Content";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";
import "./ThumbnailGrid.css";
import { ThumbnailGridProps } from "./ThumbnailGrid.types";
export default function ThumbnailGrid<T>({
	items,
	value,
	onChange,
	renderPreview,
	empty = "No items",
	columns = 3,
	className,
}: ThumbnailGridProps<T>) {
	if (!items.length)
		return (
			<Content className="oakd-thumbnail-grid__empty" pad>
				{typeof empty === "string" ? <Paragraph>{empty}</Paragraph> : empty}
			</Content>
		);
	return (
		<Content
			className={["oakd-thumbnail-grid", className].filter(Boolean).join(" ")}
			style={
				{ "--oakd-thumbnail-grid-columns": columns } as React.CSSProperties
			}
		>
			{items.map((item) => (
				<Button
					key={item.id}
					disabled={item.disabled || item.loading}
					aria-pressed={Object.is(item.value, value)}
					variant={Object.is(item.value, value) ? "active" : "default"}
					className="oakd-thumbnail-grid__item"
					onClick={() => onChange?.(item.value, item)}
				>
					<Content className="oakd-thumbnail-grid__preview">
						{item.loading ? (
							<Paragraph>Loading…</Paragraph>
						) : (
							(renderPreview?.(item) ?? item.preview)
						)}
					</Content>
					{typeof item.title === "string" ? (
						<Paragraph className="oakd-thumbnail-grid__title">
							{item.title}
						</Paragraph>
					) : (
						item.title
					)}
				</Button>
			))}
		</Content>
	);
}
