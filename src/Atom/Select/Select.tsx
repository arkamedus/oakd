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
						defaultValue,
						placeholder,
						onSelected,
						type = "ghost",
						size = "default",
						categorize,
						fixed = false
					})=> {
	const [isActive, setIsActive] = useState(false);
	const [selectedValue, setSelectedValue] = useState<any | undefined>(defaultValue);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleMenu = useCallback(() => {
		setIsActive((current) => !current);
	}, []);

	const selectOption = useCallback(
		(value: any) => {
			setSelectedValue(value);
			onSelected(value);
			setIsActive(false);
		},
		[onSelected]
	);

	const handleButtonKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				toggleMenu();
			}
		},
		[toggleMenu]
	);

	const handleOptionKeyDown = useCallback(
		(event: KeyboardEvent<HTMLSpanElement>, value: any) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				selectOption(value);
			}
		},
		[selectOption]
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
		setSelectedValue(defaultValue);
	}, [defaultValue]);

	const getCategorizedOptions = useCallback(() => {
		const categorizedOptions: { [key: string]: SelectOption<any>[] } = {};
		const uncategorizedOptions: SelectOption<any>[] = [];

		options.forEach((option) => {
			const category = option.category || "Uncategorized";
			if (categorize && option.category) {
				if (!categorizedOptions[category]) {
					categorizedOptions[category] = [];
				}
				categorizedOptions[category].push(option);
			} else {
				uncategorizedOptions.push(option);
			}
		});

		const orderedCategories = categorize?.order || [];
		const sortedCategories = Object.keys(categorizedOptions).sort((a, b) => {
			const indexA = orderedCategories.indexOf(a);
			const indexB = orderedCategories.indexOf(b);
			return (indexA !== -1 ? indexA : Infinity) - (indexB !== -1 ? indexB : Infinity);
		});

		return { categorizedOptions, sortedCategories, uncategorizedOptions };
	}, [options, categorize]);

	const { categorizedOptions, sortedCategories, uncategorizedOptions } = getCategorizedOptions();
	const shouldShowCategories = categorize && sortedCategories.length > 0;

	const selectedElement =
		(typeof selectedValue === "string" && selectedValue !== ""
			? options.find((option) => option.value === selectedValue)?.element
			: placeholder) || <span>Select an option</span>;

	// When fixed mode is active, compute the dropdown's top/left positions.
	const fixedStyle =
		fixed && dropdownRef.current
			? {
				top: dropdownRef.current.getBoundingClientRect().bottom,
				left: dropdownRef.current.getBoundingClientRect().left,
			}
			: undefined;

	// Build className based on mode and active state.
	const dropdownClassName = `oakd-select__dropdown oakd-select__dropdown--left ${
		isActive ? "active" : ""
	} ${fixed ? "oakd-select__dropdown--fixed" : "oakd-select__dropdown--absolute"}`;

	return (
		<div ref={dropdownRef} className="oakd-select" data-testid="Select">
			<Button
				onClick={toggleMenu}
				className="oakd-select__button"
				type={type}
				size={size}
				aria-haspopup="listbox"
				aria-expanded={isActive}
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
										<span
											key={String(option.value)}
											className="oakd-select__item"
											role="option"
											tabIndex={0}
											onClick={() => selectOption(option.value)}
											onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
										>
                        {option.element}
                      </span>
									))}
								</Space>
							</div>
						))
						: uncategorizedOptions.map((option) => (
							<span
								key={String(option.value)}
								className="oakd-select__item"
								role="option"
								tabIndex={0}
								onClick={() => selectOption(option.value)}
								onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
							>
                  {option.element}
                </span>
						))}
				</Space>
			</div>
		</div>
	);
};

export default Select;
