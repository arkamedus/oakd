import React from "react";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import { IconX } from "../../Icon/Icons.bin";
import "./Modal.css";
import Content from "../../Layout/Content/Content";
import Page from "../../Layout/Page/Page";

// Modal Component
const Modal = ({
	visible,
	title,
	content,
	onClose,
	children,
	className,
	style,
}: {
	visible: boolean;
	title: React.ReactNode;
	children?: React.ReactNode;
	content?: React.ReactNode;
	onClose: () => void;
	className?: string;
	style?: any;
}) =>
	visible ? (
		<div className="modal-container" onClick={onClose} style={style}>
			<Page
				className={["modal", className].join(" ")}
				onClick={(e) => e.stopPropagation()}
			>
					<Content wide pad>
						<Space justify={"between"} noWrap align={"start"} gap>
						{title}
						<Button size={"small"} icon={"X"} type="default" onClick={() => {
							if (onClose) {
								onClose()
							}
						}}></Button>
					</Space>
					</Content>

					<Content grow>{content||children}</Content>


			</Page>
		</div>
	) : null;

export { Modal };
