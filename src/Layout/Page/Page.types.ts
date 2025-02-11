import React from "react";

export interface PageProps {
	children: React.ReactNode;
	fixed?: boolean;
	gap?: boolean;
	className?: string;
}
