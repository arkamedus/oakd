export interface CollapsibleProps {
	title: string | React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	onToggle?: (isOpen: boolean) => void;
	action?: any | React.ReactNode;
}
