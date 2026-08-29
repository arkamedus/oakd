import React from "react";
export interface ThumbnailGridItem<T> {
	id: React.Key;
	value: T;
	title: React.ReactNode;
	preview?: React.ReactNode;
	disabled?: boolean;
	loading?: boolean;
}
export interface ThumbnailGridProps<T> {
	items: ThumbnailGridItem<T>[];
	value?: T;
	onChange?: (value: T, item: ThumbnailGridItem<T>) => void;
	renderPreview?: (item: ThumbnailGridItem<T>) => React.ReactNode;
	empty?: React.ReactNode;
	columns?: number;
	className?: string;
}
