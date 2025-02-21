// Tabs.tsx
import React from "react";
import { TabsProps } from "./Tabs.types";
import "./Tabs.css";
import Space from "../Space/Space";
import { IconAngle } from "../../Icon/Icons.bin";
import Button, { ButtonGroup } from "../Button/Button";

const Tabs: React.FC<TabsProps> = ({
	children,
	style,
	onChange,
	defaultActiveKey,
	activeKey,
	orientation = "horizontal",
	...props
}) => {
	const [activeKeyState, setActiveKeyState] = React.useState<
		string | undefined
	>(defaultActiveKey ?? React.Children.toArray(children)[0]?.key?.toString());
	const activeKeyControlled = activeKey !== undefined;
	const activeKeyCurrent = activeKeyControlled ? activeKey : activeKeyState;

	const handleTabClick = (key: string) => {
		if (!activeKeyControlled) {
			setActiveKeyState(key);
		}
		onChange?.(key);
	};

	const renderTab = (child: React.ReactElement, index: number) => {
		const key = child.key?.toString() || index.toString();
		const isActive = key === activeKeyCurrent;
		const tabClassName = [
			"oakd",
			"tab",
			orientation,
			isActive ? "active" : "",
		].join(" ");

		return (
			<Button
				key={key}
				className={tabClassName}
				data-testid="Tab"
				role="tab"
				aria-selected={isActive}
				onClick={() => handleTabClick(key)}
			>
				<Space gap align="center" style={{ height: "100%" }} noWrap>
					{child.props.icon || <IconAngle size="small" />}
					<span>{child.props.label}</span>
				</Space>
			</Button>
		);
	};

	const renderContent = () => {
		return React.Children.map(children, (child, index) => {
			if (!React.isValidElement(child)) return null;
			const key = child.key?.toString() || index.toString();
			return (
				<div
					role="tabpanel"
					key={key}
					hidden={key !== activeKeyCurrent}
					className={key !== activeKeyCurrent ? "hidden" : ""}
					style={{ flex: 1, width: "100%" }}
				>
					{child.props.children}
				</div>
			);
		});
	};

	return (
		<div
			style={style}
			className={["oakd", "tabs", orientation].join(" ")}
			data-testid="Tabs"
			{...props}
		>
			<Space
				gap
				direction={orientation == "horizontal" ? "vertical" : "horizontal"}
				style={{}}
				noWrap
			>
				<ButtonGroup direction={orientation}>
					{React.Children.map(children, renderTab)}
				</ButtonGroup>
				{renderContent()}
			</Space>
		</div>
	);
};

interface TabProps {
	label: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
	return <>{children}</>;
};

export default Tabs;
