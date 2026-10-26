export interface CollapsibleProps {
	title: React.ReactNode;
	/** Body content owns its padding and any optional dividers. */
	children: React.ReactNode;
	defaultOpen?: boolean;
	onToggle?: (isOpen: boolean) => void;
}
