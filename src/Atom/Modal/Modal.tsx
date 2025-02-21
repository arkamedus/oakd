import React from "react";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import { IconX } from "../../Icon/Icons.bin";
import "./Modal.css";

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
			<div
				className={["modal", className].join(" ")}
				onClick={(e) => e.stopPropagation()}
			>
				<Space direction={"vertical"} gap>
					<Space justify={"between"} align={"start"} gap>
						<Paragraph>{title}</Paragraph>
						<Button
							onClick={() => {
								if (onClose) {
									onClose();
								}
							}}
						>
							<IconX />{" "}
						</Button>
					</Space>
					<Space direction={"vertical"} gap>
						<Paragraph>{content || children}</Paragraph>
					</Space>
				</Space>
			</div>
		</div>
	) : null;

export { Modal };
