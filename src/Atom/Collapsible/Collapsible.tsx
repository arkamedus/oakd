import React, { useEffect, useState } from "react";
import { CollapsibleProps } from "./Collapsible.types";
import "./Collapsible.css";
import { IconAngle } from "../../Icon/Icons.bin";
import Space from "../Space/Space";
import Content from "../../Layout/Content/Content";
import Paragraph from "../Paragraph/Paragraph";

/**
 * The Collapsible component renders a section that can be expanded or collapsed.
 * It displays a title and an optional action area, along with its children content.
 *
 * It accepts the following props:
 * - title (string): The title text to display.
 * - children (React.ReactNode): The content to show when expanded.
 * - defaultOpen (boolean): Initial state of the collapsible section (open/closed).
 * - onToggle (function): Callback function triggered when the section is opened or closed.
 * - action (React.ReactNode): Optional component to render an action area beside the title.
 *
 * The component maintains an internal state to track whether it is expanded or collapsed,
 * and it animates the height of the content area during transitions.
 */
const Collapsible: React.FC<CollapsibleProps> = ({
	title,
	children,
	action,
	defaultOpen = false,
	onToggle,
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [contentHeight, setContentHeight] = useState<string | number>("auto");

	/**
	 * Toggles the open state and triggers the onToggle callback if provided.
	 */
	const toggle = () => {
		setIsOpen((prev) => !prev);
	};

	/**
	 * Updates the content height when the open state changes.
	 */
	useEffect(() => {
		setContentHeight(isOpen ? "auto" : "0");
		if (onToggle) onToggle(!isOpen);
	}, [isOpen, onToggle]);

	return (
		<Space
			className="collapsible"
			data-testid="Collapsible"
			align={"center"}
			wide
		>
			<Content pad wide>
				<Space wide gap justify={"between"} align={"center"}>
					<button
						className="collapsible__toggle"
						aria-expanded={isOpen}
						onClick={toggle}
						type="button"
						style={{ width: "100%" }}
					>
						<Space wide justify={"between"} align={"center"}>
							<span className="collapsible__title">{title}</span>
							<IconAngle
								className="collapsible__icon"
								size={"small"}
								rotation={isOpen ? 90 : 0}
								//name="caret"
								role="img"
								aria-hidden="true"
							/>
						</Space>
					</button>
					{action && action}
				</Space>
			</Content>
			<div
				className="collapsible__content"
				style={{
					transition: "height 0.3s ease-in-out",
					height: contentHeight,
				}}
			>
				<div className="collapsible__inner">{children}</div>
			</div>
		</Space>
	);
};

export default Collapsible;
