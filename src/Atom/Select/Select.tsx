import React, { useEffect, useRef, useState, useCallback, KeyboardEvent } from "react";
import { SelectOption, SelectProps } from "./Select.types";
import "./Select.css";
import Button from "../Button/Button";
import Space from "../Space/Space";
import { IconAngle } from "../../Icon/Icons.bin";
import Divider from "../Divider/Divider";

const Select = <T,>({
  options,
  defaultValue,
  placeholder,
  onSelected,
  type = "ghost",
  categorize
}: SelectProps<T>): JSX.Element => {
  const [isActive, setIsActive] = useState(false);
  const [selectedValue, setSelectedValue] = useState<T | undefined>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => {
    setIsActive(current => !current);
  }, []);

  const selectOption = useCallback((value: T) => {
    setSelectedValue(value);
    onSelected(value);
    setIsActive(false);
  }, [onSelected]);

  const handleButtonKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu();
    }
  }, [toggleMenu]);

  const handleOptionKeyDown = useCallback((event: KeyboardEvent<HTMLSpanElement>, value: T) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(value);
    }
  }, [selectOption]);

  const closeMenu = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    const categorizedOptions: { [key: string]: SelectOption<T>[] } = {};
    const uncategorizedOptions: SelectOption<T>[] = [];

    options.forEach(option => {
      const category = option.category || 'Uncategorized';
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

  const selectedElement = ((typeof selectedValue === "string" && selectedValue !== "")
    ? options.find(option => option.value === selectedValue)?.element
    : (placeholder ? placeholder : <span>Select an option</span>));

  return (
    <div ref={dropdownRef} className="dropdown-container" data-testid="Select">
      <Button
        onClick={toggleMenu}
        //onKeyDown={handleButtonKeyDown}
        className="menu-button"
        type={type}
        aria-haspopup="listbox"
        aria-expanded={isActive}
      >
        <Space align="center" gap>
          {selectedElement}
          <IconAngle />
        </Space>
      </Button>

      <div className={`oakd dropdown-inner left ${isActive ? "active" : ""}`} role="listbox">
        <Space direction="vertical" gap wide justify={"stretch"}>
          {shouldShowCategories ? (
            sortedCategories.map(category => (
              <div key={category}>
                <Space direction="vertical" gap>
                  <Space gap className="no-select">
                    <strong className="muted-heavy">{category}</strong>
                    <Divider />
                  </Space>
                  {categorizedOptions[category].map(option => (
                    <span
                      key={String(option.value)}
                      className="dropdown-item"
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
          ) : (
            uncategorizedOptions.map(option => (
              <span
                key={String(option.value)}
                className="dropdown-item"
                role="option"
                tabIndex={0}
                onClick={() => selectOption(option.value)}
                onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
              >
                {option.element}
              </span>
            ))
          )}
        </Space>
      </div>
    </div>
  );
};

export default Select;
