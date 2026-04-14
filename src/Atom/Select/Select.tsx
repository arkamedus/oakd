import React, {
	useEffect,
	useRef,
	useState,
	useCallback,
	KeyboardEvent,
} from "react";
import { SelectOption, SelectProps } from "./Select.types";
import "./Select.css";
import Button from "../Button/Button";
import Space from "../Space/Space";
import { IconAngle } from "../../Icon/Icons.bin";
import Divider from "../Divider/Divider";
import Paragraph from "../Paragraph/Paragraph";
import { sizeMinusOne } from "../../Core/Core.utils";

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
	direction = "bottom-left",
	disabled = false,
	className = "",
	style,
	...rest
}) => {
	const [isActive, setIsActive] = useState(false);
	const isControlled = value !== undefined;
	const [selectedValueState, setSelectedValueState] = useState<any | undefined>(
		defaultValue,
	);
	const selectedValue = isControlled ? value : selectedValueState;
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleMenu = useCallback(() => {
		if (disabled) return;
		setIsActive((current) => !current);
	}, [disabled]);

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
		},
		[toggleMenu],
	);

	const handleOptionKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>, value: any) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				selectOption(value);
			}
		},
		[selectOption],
	);

	const closeMenu = useCallback((event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsActive(false);
		}
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

	// When fixed mode is active, compute the dropdown's top/left positions.
	const fixedStyle =
		fixed && dropdownRef.current
			? {
					top: dropdownRef.current.getBoundingClientRect().bottom,
					left: dropdownRef.current.getBoundingClientRect().left,
				}
			: undefined;

	// Build className based on mode and active state.
	const dropdownClassName = `oakd-select__dropdown oakd-select__dropdown--${direction} ${
		isActive ? "active" : ""
	} ${fixed ? "oakd-select__dropdown--fixed" : "oakd-select__dropdown--absolute"}`;

	return (
		<div
			{...rest}
			ref={dropdownRef}
			className={["oakd-select", className].filter(Boolean).join(" ")}
			style={style}
			data-testid="Select"
		>
			<Button
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
			<div
				className={dropdownClassName}
				role="listbox"
				aria-hidden={!isActive}
				style={fixed ? fixedStyle : undefined}
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
										{categorizedOptions[category].map((option) => (
											<button
												key={String(option.value)}
												type="button"
												className="oakd-select__item"
												role="option"
												aria-selected={option.value === selectedValue}
												onClick={() => selectOption(option.value)}
												onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
											>
												{option.element}
											</button>
										))}
									</Space>
								</div>
							))
						: uncategorizedOptions.map((option) => (
								<button
									key={String(option.value)}
									type="button"
									className="oakd-select__item"
									role="option"
									aria-selected={option.value === selectedValue}
									onClick={() => selectOption(option.value)}
									onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
								>
									{option.element}
								</button>
							))}
				</Space>
			</div>
		</div>
	);
};

export default Select;
