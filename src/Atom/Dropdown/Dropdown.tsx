import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DropdownProps } from "./Dropdown.types";
import "./Dropdown.css";
import Button from "../Button/Button";
import { getAdaptiveDropdownPlacement } from "./dropdownPlacement";

const Dropdown: React.FC<DropdownProps> = ({
	children,
	direction = "bottom-left",
	fixed = false,
	grow = false,
	label = "Toggle Dropdown",
	className = "",
	onFocusCapture,
	onKeyDown,
	onKeyDownCapture,
	onPointerDownCapture,
	placementThreshold = 0.6,
	style,
	wide = false,
	...rest
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [adaptiveDirection, setAdaptiveDirection] = useState(direction);
	const [placementStyle, setPlacementStyle] = useState<React.CSSProperties>({});
	const dropdownRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const syncPlacement = useCallback(() => {
		if (!dropdownRef.current) {
			return;
		}
		const placement = getAdaptiveDropdownPlacement(
			dropdownRef.current,
			direction,
			placementThreshold,
		);
		setAdaptiveDirection(placement.direction);
		setPlacementStyle(placement.style);
	}, [direction, placementThreshold]);

	const closeDropdown = useCallback(() => setIsOpen(false), []);
	const toggleDropdown = useCallback(() => {
		syncPlacement();
		setIsOpen((current) => !current);
	}, [syncPlacement]);

	const handleClickOutside = useCallback((event: MouseEvent) => {
		const target = event.target as Node | null;
		if (
			target &&
			(dropdownRef.current?.contains(target) || menuRef.current?.contains(target))
		) {
			return;
		}
		closeDropdown();
	}, [closeDropdown]);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [handleClickOutside]);

	const menu = (
		<div
			ref={menuRef}
			className={[
				"oakd-dropdown-content",
				adaptiveDirection,
				fixed ? "fixed" : "",
				isOpen ? "active" : "",
				wide ? "wide" : "",
				grow ? "grow" : "",
				className,
			].filter(Boolean).join(" ")}
			style={fixed ? { ...style, ...placementStyle } : style}
		>
			{children}
		</div>
	);

	return (
		<div
			{...rest}
			className={[
				"oakd-dropdown-container",
				wide ? "wide" : "",
				grow ? "grow" : "",
				className,
			].filter(Boolean).join(" ")}
			ref={dropdownRef}
			onFocusCapture={(event) => {
				syncPlacement();
				onFocusCapture?.(event);
			}}
			onKeyDown={(event) => {
				if (event.key === "Escape") {
					closeDropdown();
				}
				onKeyDown?.(event);
			}}
			onKeyDownCapture={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					syncPlacement();
				}
				onKeyDownCapture?.(event);
			}}
			onPointerDownCapture={(event) => {
				syncPlacement();
				onPointerDownCapture?.(event);
			}}
			style={style}
		>
			<Button
				htmlType="button"
				onClick={toggleDropdown}
				aria-haspopup="true"
				aria-expanded={isOpen}
				className="oakd-dropdown-trigger"
			>
				{label}
			</Button>
			{isOpen && fixed && typeof document !== "undefined"
				? createPortal(menu, document.body)
				: menu}
		</div>
	);
};

export default Dropdown;
