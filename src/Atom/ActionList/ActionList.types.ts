import React from "react";
export interface ActionListProps extends React.HTMLAttributes<HTMLDivElement> {
	divided?: boolean;
}
export interface ActionListItemProps extends Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"title"
> {
	leading?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	trailing?: React.ReactNode;
	disabled?: boolean;
}
