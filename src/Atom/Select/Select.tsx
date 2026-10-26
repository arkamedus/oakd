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
import ActionList, { ActionListItem } from "../ActionList/ActionList";
import type { ActionListItemProps } from "../ActionList/ActionList.types";
import Card from "../Card/Card";
import Content from "../../Layout/Content/Content";

const Select = <T,>({
  options,
  value,
  defaultValue,
  placeholder,
  onChange,
  variant = "default",
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
  open,
  defaultOpen = false,
  onOpenChange,
  emptyContent = "No options",
  ...rest
}: SelectProps<T>) => {
  disabled = disabled || variant === "disabled";
  variant = disabled ? "disabled" : variant;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isActive = !disabled && (open ?? internalOpen);
  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open],
  );
  const [adaptiveDirection, setAdaptiveDirection] = useState(direction);
  const [placementStyle, setPlacementStyle] = useState<React.CSSProperties>({});
  const isControlled = value !== undefined;
  const [selectedValueState, setSelectedValueState] = useState<T | undefined>(
    defaultValue,
  );
  const selectedValue = isControlled ? value : selectedValueState;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
    setOpen(!isActive);
  }, [disabled, isActive, setOpen, syncPlacement]);

  const selectOption = useCallback(
    (option: SelectOption<T>) => {
      if (disabled || option.disabled) return;
      if (!isControlled) {
        setSelectedValueState(option.value);
      }
      onChange?.(option.value);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [disabled, isControlled, onChange, setOpen],
  );

  const handleButtonKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleMenu();
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!isActive) setOpen(true);
        window.setTimeout(
          () =>
            menuRef.current
              ?.querySelectorAll<HTMLElement>(
                '[role="option"]:not([aria-disabled="true"])',
              )[0]
              ?.focus(),
          0,
        );
      }
    },
    [disabled, isActive, setOpen, toggleMenu],
  );

  const handleOptionKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const items = Array.from(
          menuRef.current?.querySelectorAll<HTMLElement>(
            '[role="option"]:not([aria-disabled="true"])',
          ) || [],
        );
        const current = items.indexOf(event.currentTarget);
        const next = event.key === "ArrowDown" ? current + 1 : current - 1;
        items[(next + items.length) % items.length]?.focus();
      }
    },
    [setOpen],
  );

  const closeMenu = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        target &&
        (dropdownRef.current?.contains(target) ||
          menuRef.current?.contains(target))
      ) {
        return;
      }
      setOpen(false);
    },
    [setOpen],
  );

  useEffect(() => {
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, [closeMenu]);

  useEffect(() => {
    if (!isActive) return;
    window.addEventListener("resize", syncPlacement);
    window.addEventListener("scroll", syncPlacement, true);
    return () => {
      window.removeEventListener("resize", syncPlacement);
      window.removeEventListener("scroll", syncPlacement, true);
    };
  }, [isActive, syncPlacement]);

  useEffect(() => {
    if (!isControlled) {
      setSelectedValueState(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const getCategorizedOptions = useCallback(() => {
    const categorizedOptions: { [key: string]: SelectOption<T>[] } = {};
    const uncategorizedOptions: SelectOption<T>[] = [];

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
  const selectedContent = selectedOption?.label ||
    selectedOption?.element ||
    placeholder || <Paragraph>Select an option</Paragraph>;
  const selectedElement =
    typeof selectedContent === "string" ? (
      <Paragraph>{selectedContent}</Paragraph>
    ) : (
      selectedContent
    );

  const dropdownClassName = [
    "oakd-select__dropdown",
    `oakd-select__dropdown--${adaptiveDirection}`,
    isActive ? "active" : "",
    fixed ? "oakd-select__dropdown--fixed" : "oakd-select__dropdown--absolute",
    wide ? "wide" : "",
    grow ? "grow" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderOption = (option: SelectOption<T>) => {
    const suppliedItem =
      React.isValidElement<ActionListItemProps>(option.element) &&
      option.element.type === ActionListItem ? (
        option.element
      ) : (
        <ActionListItem title={option.element} />
      );
    const suppliedOnClick = suppliedItem.props.onClick;
    const suppliedOnKeyDown = suppliedItem.props.onKeyDown;
    const itemDisabled = option.disabled || suppliedItem.props.disabled;

    return React.cloneElement(suppliedItem, {
      key: String(option.value),
      role: "option",
      "aria-selected": option.value === selectedValue,
      disabled: itemDisabled,
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        const wasAlreadyPrevented = event.defaultPrevented;
        suppliedOnClick?.(event);
        if (wasAlreadyPrevented || !event.defaultPrevented) {
          selectOption(option);
        }
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        handleOptionKeyDown(event);
        suppliedOnKeyDown?.(event);
      },
    });
  };

  const menu = (
    <Card
      ref={menuRef}
      className={dropdownClassName}
      role="listbox"
      aria-hidden={!isActive}
      style={fixed ? { ...style, ...placementStyle } : undefined}
    >
      <Space direction="vertical" wide justify="stretch">
        {shouldShowCategories ? (
          sortedCategories.map((category) => (
            <Content key={category} wide>
              <Space direction="vertical" wide>
                <Content pad wide>
                  <Paragraph>
                    <strong>{category}</strong>
                  </Paragraph>
                </Content>
                <Divider />
                <ActionList role="presentation" divided={false}>
                  {categorizedOptions[category].map(renderOption)}
                </ActionList>
              </Space>
            </Content>
          ))
        ) : (
          <ActionList role="presentation" divided={false}>
            {uncategorizedOptions.map(renderOption)}
          </ActionList>
        )}
        {!options.length ? (
          <Content className="oakd-select__empty" pad>
            {typeof emptyContent === "string" ? (
              <Paragraph>{emptyContent}</Paragraph>
            ) : (
              emptyContent
            )}
          </Content>
        ) : null}
      </Space>
    </Card>
  );

  return (
    <Content
      {...rest}
      ref={dropdownRef}
      className={[
        "oakd-select",
        wide ? "wide" : "",
        grow ? "grow" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
        ref={triggerRef}
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
          <IconAngle size={sizeMinusOne(size)} rotation={isActive ? 90 : 0} />
        </Space>
      </Button>
      {isActive && fixed && typeof document !== "undefined"
        ? createPortal(menu, document.body)
        : menu}
    </Content>
  );
};

export default Select;
