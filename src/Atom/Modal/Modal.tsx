import React from "react";
import Space from "../Space/Space";
import Button from "../Button/Button";
import "./Modal.css";
import Content from "../../Layout/Content/Content";
import Page from "../../Layout/Page/Page";
import { ModalProps } from "./Modal.types";

// Modal Component
const Modal = ({
	visible,
	title,
	onClose,
	children,
	className,
	style,
	closeButtonLabel = "Close modal",
}: ModalProps) =>
	visible ? (
		<div className="modal-container" onClick={onClose} style={style}>
			<Page
				role="dialog"
				aria-modal="true"
				className={["modal", className].join(" ")}
				onClick={(e) => e.stopPropagation()}
			>
				<Content wide pad>
					<Space justify={"between"} noWrap align={"center"} gap>
						{title}
						<Button
							size={"small"}
							icon={"X"}
							variant="default"
							aria-label={closeButtonLabel}
							onClick={onClose}
						/>
					</Space>
				</Content>

				<Content grow>{children}</Content>
			</Page>
		</div>
	) : null;

export { Modal };
