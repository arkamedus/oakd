import React, {
	KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { SelectOption, SelectProps } from "./Select.types";
import "./Select.css";
import Button from "../Button/Button";
import Space from "../Space/Space";
import { IconAngle } from "../../Icon/Icons.bin";
import Divider from "../Divider/Divider";
import Paragraph from "../Paragraph/Paragraph";
import { sizeMinusOne } from "../../Core/Core.utils";
import { getAdaptiveDropdownPlacement } from "../Dropdown/dropdownPlacement";

const Select: React.FC<SelectProps<any>> = ({
	options,
	value,
	defaultValue,
	placeholder,
	onChange,
	variant = "ghost",
	size = "default",
	categoryOrder,
	fixed = false,
	grow = false,
	direction = "bottom-left",
	disabled = false,
	className = "",
	onFocusCapture,
	onKeyDownCapture,
	onPointerDownCapture,
	placementThreshold = 0.6,
	style,
	wide = false,
	...rest
}) => {
	const [isActive, setIsActive] = useState(false);
	const [adaptiveDirection, setAdaptiveDirection] = useState(direction);
	const [placementStyle, setPlacementStyle] = useState<React.CSSProperties>({});
	const isControlled = value !== undefined;
	const [selectedValueState, setSelectedValueState] = useState<any | undefined>(
		defaultValue,
	);
	const selectedValue = isControlled ? value : selectedValueState;
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

	const toggleMenu = useCallback(() => {
		if (disabled) return;
		syncPlacement();
		setIsActive((current) => !current);
	}, [disabled, syncPlacement]);

	const selectOption = useCallback(
		(value: any) => {
			if (!isControlled) {
				setSelectedValueState(value);
			}
			onChange?.(value);
			setIsActive(false);
		},
		[isControlled, onChange],
	);

	const handleButtonKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				toggleMenu();
			}
			if (event.key === "Escape") {
				setIsActive(false);
			}
		},
		[toggleMenu],
	);

	const handleOptionKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>, value: any) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				selectOption(value);
			}
			if (event.key === "Escape") {
				setIsActive(false);
			}
		},
		[selectOption],
	);

	const closeMenu = useCallback((event: MouseEvent) => {
		const target = event.target as Node | null;
		if (
			target &&
			(dropdownRef.current?.contains(target) || menuRef.current?.contains(target))
		) {
			return;
		}
		setIsActive(false);
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", closeMenu);
		return () => {
			document.removeEventListener("mousedown", closeMenu);
		};
	}, [closeMenu]);

	useEffect(() => {
		if (!isControlled) {
			setSelectedValueState(defaultValue);
		}
	}, [defaultValue, isControlled]);

	const getCategorizedOptions = useCallback(() => {
		const categorizedOptions: { [key: string]: SelectOption<any>[] } = {};
		const uncategorizedOptions: SelectOption<any>[] = [];

		options.forEach((option) => {
			const category = option.category || "Uncategorized";
			if (categoryOrder && option.category) {
				if (!categorizedOptions[category]) {
					categorizedOptions[category] = [];
				}
				categorizedOptions[category].push(option);
			} else {
				uncategorizedOptions.push(option);
			}
		});

		const orderedCategories = categoryOrder || [];
		const sortedCategories = Object.keys(categorizedOptions).sort((a, b) => {
			const indexA = orderedCategories.indexOf(a);
			const indexB = orderedCategories.indexOf(b);
			return (
				(indexA !== -1 ? indexA : Infinity) -
				(indexB !== -1 ? indexB : Infinity)
			);
		});

		return { categorizedOptions, sortedCategories, uncategorizedOptions };
	}, [options, categoryOrder]);

	const { categorizedOptions, sortedCategories, uncategorizedOptions } =
		getCategorizedOptions();
	const shouldShowCategories =
		!!categoryOrder?.length && sortedCategories.length > 0;

	const selectedOption = options.find(
		(option) => option.value === selectedValue,
	);
	const selectedElement = selectedOption?.element || placeholder || (
		<span>Select an option</span>
	);

	const dropdownClassName = [
		"oakd-select__dropdown",
		`oakd-select__dropdown--${adaptiveDirection}`,
		isActive ? "active" : "",
		fixed ? "oakd-select__dropdown--fixed" : "oakd-select__dropdown--absolute",
		wide ? "wide" : "",
		grow ? "grow" : "",
	].filter(Boolean).join(" ");

	const renderOption = (option: SelectOption<any>) => (
		<button
			key={String(option.value)}
			type="button"
			className="oakd-select__item"
			role="option"
			aria-selected={option.value === selectedValue}
			onClick={() => selectOption(option.value)}
			onKeyDown={(event) => handleOptionKeyDown(event, option.value)}
		>
			{option.element}
		</button>
	);

	const menu = (
		<div
			ref={menuRef}
			className={dropdownClassName}
			role="listbox"
			aria-hidden={!isActive}
			style={fixed ? { ...style, ...placementStyle } : undefined}
		>
			<Space direction="vertical" gap wide justify="stretch">
				{shouldShowCategories
					? sortedCategories.map((category) => (
							<div key={category}>
								<Space direction="vertical" gap>
									<Space gap className="no-select" wide>
										<Paragraph>
											<strong className="muted-heavy">{category}</strong>
										</Paragraph>
										<Divider />
									</Space>
									{categorizedOptions[category].map(renderOption)}
								</Space>
							</div>
						))
					: uncategorizedOptions.map(renderOption)}
			</Space>
		</div>
	);

	return (
		<div
			{...rest}
			ref={dropdownRef}
			className={[
				"oakd-select",
				wide ? "wide" : "",
				grow ? "grow" : "",
				className,
			].filter(Boolean).join(" ")}
			style={style}
			data-testid="Select"
			onFocusCapture={(event) => {
				syncPlacement();
				onFocusCapture?.(event);
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
		>
			<Button
				htmlType="button"
				onClick={toggleMenu}
				className="oakd-select__button"
				variant={variant}
				size={size}
				aria-haspopup="listbox"
				aria-expanded={isActive}
				disabled={disabled}
				onKeyDown={handleButtonKeyDown}
			>
				<Space align="center" gap>
					{selectedElement}
					<IconAngle size={sizeMinusOne(size)} />
				</Space>
			</Button>
			{isActive && fixed && typeof document !== "undefined"
				? createPortal(menu, document.body)
				: menu}
		</div>
	);
};

export default Select;
