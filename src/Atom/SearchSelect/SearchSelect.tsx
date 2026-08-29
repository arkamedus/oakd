import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Content from "../../Layout/Content/Content";
import ScrollArea from "../../Layout/ScrollArea/ScrollArea";
import Button from "../Button/Button";
import Card from "../Card/Card";
import { getAdaptiveDropdownPlacement } from "../Dropdown/dropdownPlacement";
import Input from "../Input/Input";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import Icon from "../../Icon/Icon";
import ActionList, { ActionListItem } from "../ActionList/ActionList";
import type { ActionListItemProps } from "../ActionList/ActionList.types";
import { sizeMinusOne } from "../../Core/Core.utils";
import "./SearchSelect.css";
import { SearchSelectOption, SearchSelectProps } from "./SearchSelect.types";

export default function SearchSelect<T>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search…",
  emptyContent = "No matching options",
  getOptionKey = (option) => String(option.value),
  open,
  onOpenChange,
  disabled,
  wide,
  size = "default",
  className,
  ...rest
}: SearchSelectProps<T>) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [placement, setPlacement] = useState<React.CSSProperties>({});
  const selectedValue = value ?? internalValue;
  const isOpen = open ?? internalOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => {
      const text =
        option.searchText ||
        (typeof option.label === "string" ? option.label : "");
      return text.toLowerCase().includes(normalized);
    });
  }, [options, query]);
  const selected = options.find((option) =>
    Object.is(option.value, selectedValue),
  );
  useEffect(() => {
    if (!isOpen) return;
    const sync = () => {
      if (rootRef.current)
        setPlacement(
          getAdaptiveDropdownPlacement(rootRef.current, "bottom-left").style,
        );
    };
    const outside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      )
        setOpen(false);
    };
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    document.addEventListener("mousedown", outside);
    const timer = window.setTimeout(() => searchRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
      document.removeEventListener("mousedown", outside);
    };
  }, [isOpen, setOpen]);
  const choose = (option: SearchSelectOption<T>) => {
    if (option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onChange?.(option.value, option);
    setOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  };
  const renderOption = (option: SearchSelectOption<T>, index: number) => {
    const optionContent =
      option.render ??
      (typeof option.label === "string" ? (
        <Paragraph>{option.label}</Paragraph>
      ) : (
        option.label
      ));
    const suppliedItem =
      React.isValidElement<ActionListItemProps>(optionContent) &&
      optionContent.type === ActionListItem ? (
        optionContent
      ) : (
        <ActionListItem title={optionContent} />
      );
    const suppliedOnClick = suppliedItem.props.onClick;
    const itemDisabled = option.disabled || suppliedItem.props.disabled;

    return React.cloneElement(suppliedItem, {
      key: getOptionKey(option),
      role: "option",
      "aria-selected": Object.is(option.value, selectedValue),
      disabled: itemDisabled,
      onMouseEnter: () => setActiveIndex(index),
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        suppliedOnClick?.(event);
        if (!event.defaultPrevented) choose(option);
      },
    });
  };
  const menu = (
    <Card
      ref={menuRef}
      className="oakd-search-select__menu"
      style={placement}
      role="listbox"
    >
      <Space direction="vertical" wide>
        <Content pad wide>
          <Input
            ref={searchRef}
            value={query}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) =>
                  Math.min(filtered.length - 1, index + 1),
                );
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) => Math.max(0, index - 1));
              } else if (event.key === "Enter" && filtered[activeIndex]) {
                event.preventDefault();
                choose(filtered[activeIndex]);
              } else if (event.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
              }
            }}
            grow
          />
        </Content>
        <ScrollArea className="oakd-search-select__options" wide>
          {filtered.length ? (
            <ActionList role="presentation" divided={false}>
              {filtered.map(renderOption)}
            </ActionList>
          ) : (
            <Content className="oakd-search-select__empty" pad>
              {typeof emptyContent === "string" ? (
                <Paragraph>{emptyContent}</Paragraph>
              ) : (
                emptyContent
              )}
            </Content>
          )}
        </ScrollArea>
      </Space>
    </Card>
  );
  return (
    <Content
      {...rest}
      ref={rootRef}
      className={[
        "oakd-search-select",
        `size-${size}`,
        wide && "wide",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Button
        ref={triggerRef}
        size={size}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="oakd-search-select__trigger"
        onClick={() => setOpen(!isOpen)}
      >
        <Space align="center" justify="between" gap wide noWrap>
          {typeof (selected?.label ?? placeholder) === "string" ? (
            <Paragraph>{selected?.label ?? placeholder}</Paragraph>
          ) : (
            (selected?.label ?? placeholder)
          )}
          <Icon
            name="Angle"
            size={sizeMinusOne(size)}
            rotation={isOpen ? 90 : 0}
          />
        </Space>
      </Button>
      {isOpen && typeof document !== "undefined"
        ? createPortal(menu, document.body)
        : null}
    </Content>
  );
}
