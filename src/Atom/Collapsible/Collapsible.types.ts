export interface CollapsibleProps {
	title: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	onToggle?: (isOpen: boolean) => void;
}
