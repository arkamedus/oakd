import React, { useState, useRef, useEffect } from "react";
import { DropdownProps } from "./Dropdown.types";
import "./Dropdown.css";
import Button from "../Atom/Button/Button";

const Dropdown: React.FC<DropdownProps> = ({
											   children,
											   direction = "bottom-left",
											   fixed = false,
											   label = "Toggle Dropdown",
											   className = "",
										   }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleDropdown = () => setIsOpen(!isOpen);
	const closeDropdown = () => setIsOpen(false);

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)) {
			closeDropdown();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") closeDropdown();
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div
			className={`oakd-dropdown-container ${className}`}
			ref={dropdownRef}
			onKeyDown={handleKeyDown}
		>
			<Button
				onClick={toggleDropdown}
				aria-haspopup="true"
				aria-expanded={isOpen}
				className="oakd-dropdown-trigger"
			>
				{label}
			</Button>

			<div
				className={`oakd-dropdown-content ${direction} ${
					fixed ? "fixed" : ""
				} ${isOpen ? "active" : ""}`}
			>
				{children}
			</div>
		</div>
	);
};

export default Dropdown;