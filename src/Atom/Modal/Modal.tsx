import React, { useEffect, useRef } from "react";
import Button from "../Button/Button";
import Card from "../Card/Card";
import Divider from "../Divider/Divider";
import Space from "../Space/Space";
import Content from "../../Layout/Content/Content";
import "./Modal.css";
import { ModalProps } from "./Modal.types";

const Modal = ({
	open,
	title,
	header,
	footer,
	onClose,
	children,
	className,
	style,
	closeButtonLabel = "Close modal",
	size = "default",
	dismissible = true,
	bodyScroll = true,
	initialFocusRef,
}: ModalProps) => {
	const dialogRef = useRef<HTMLDivElement>(null);
	const restoreFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!open) return;
		restoreFocusRef.current = document.activeElement as HTMLElement | null;
		const dialog = dialogRef.current;
		const selector =
			'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const focusTarget =
			initialFocusRef?.current ||
			dialog?.querySelector<HTMLElement>(selector) ||
			dialog;
		focusTarget?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && dismissible) {
				event.preventDefault();
				onClose();
				return;
			}
			if (event.key !== "Tab" || !dialog) return;
			const focusable = Array.from(
				dialog.querySelectorAll<HTMLElement>(selector),
			);
			if (!focusable.length) {
				event.preventDefault();
				dialog.focus();
				return;
			}
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			restoreFocusRef.current?.focus();
		};
	}, [dismissible, initialFocusRef, onClose, open]);

	if (!open) return null;
	const renderedHeader = header ?? title;

	return (
		<Content
			className="oakd-modal-backdrop"
			onMouseDown={(event) => {
				if (dismissible && event.target === event.currentTarget) onClose();
			}}
		>
			<Card
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-label={typeof title === "string" ? title : undefined}
				tabIndex={-1}
				className={["oakd", "oakd-modal", `oakd-modal--${size}`, className]
					.filter(Boolean)
					.join(" ")}
				style={style}
			>
				{renderedHeader || dismissible ? (
					<Content className="oakd-modal__header" wide pad>
						<Space align="center" justify="between" gap wide noWrap>
							<Content className="oakd-modal__heading" grow>
								{renderedHeader}
							</Content>
							{dismissible ? (
								<Button
									size="small"
									icon="X"
									variant="ghost"
									aria-label={closeButtonLabel}
									onClick={onClose}
								/>
							) : null}
						</Space>
					</Content>
				) : null}
				{renderedHeader || dismissible ? <Divider /> : null}
				<Content
					className={[
						"oakd-modal__body",
						bodyScroll && "oakd-modal__body--scroll",
					]
						.filter(Boolean)
						.join(" ")}
					pad
				>
					{children}
				</Content>
				{footer ? <Divider /> : null}
				{footer ? (
					<Content className="oakd-modal__footer" wide pad>
						<Space align="center" justify="end" gap wide>
							{footer}
						</Space>
					</Content>
				) : null}
			</Card>
		</Content>
	);
};

export { Modal };
