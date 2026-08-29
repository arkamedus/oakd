import React from "react";
export interface EmptyStateProps extends Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"title"
> {
	icon?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
}
