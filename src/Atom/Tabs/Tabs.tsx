// Tabs.tsx
import React from "react";
import { TabProps, TabsProps } from "./Tabs.types";
import "./Tabs.css";
import Space from "../Space/Space";
import { IconAngle } from "../../Icon/Icons.bin";
import Button, { ButtonGroup } from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";
import Content from "../../Layout/Content/Content";

const getTabKey = (child: React.ReactNode, index: number) =>
  React.isValidElement<TabProps>(child)
    ? child.key?.toString() || index.toString()
    : index.toString();

const getFirstTabKey = (children: React.ReactNode) => {
  let firstKey: string | undefined;

  React.Children.forEach(children, (child, index) => {
    if (firstKey === undefined && React.isValidElement<TabProps>(child)) {
      firstKey = getTabKey(child, index);
    }
  });

  return firstKey;
};

const Tabs: React.FC<TabsProps> = ({
  children,
  style,
  onChange,
  defaultActiveKey,
  activeKey,
  orientation = "horizontal",
  ...props
}) => {
  const tabsId = React.useId();
  const [activeKeyState, setActiveKeyState] = React.useState<
    string | undefined
  >(defaultActiveKey ?? getFirstTabKey(children));
  const activeKeyControlled = activeKey !== undefined;
  const activeKeyCurrent = activeKeyControlled ? activeKey : activeKeyState;

  const handleTabClick = (key: string) => {
    if (!activeKeyControlled) {
      setActiveKeyState(key);
    }
    onChange?.(key);
  };

  const renderTab = (child: React.ReactNode, index: number) => {
    if (!React.isValidElement<TabProps>(child)) {
      return null;
    }
    const key = getTabKey(child, index);
    const tabId = `${tabsId}-tab-${key}`;
    const panelId = `${tabsId}-tabpanel-${key}`;
    const isActive = key === activeKeyCurrent;
    const tabClassName = ["oakd", "tab", orientation].join(" ");

    return (
      <Button
        key={key}
        variant={isActive ? "active" : "ghost"}
        className={tabClassName}
        data-testid="Tab"
        role="tab"
        id={tabId}
        aria-controls={panelId}
        aria-selected={isActive}
        onClick={() => handleTabClick(key)}
      >
        <Space gap align="center" fill noWrap>
          {child.props.icon || <IconAngle size="small" />}
          <Paragraph>{child.props.label}</Paragraph>
        </Space>
      </Button>
    );
  };

  const renderContent = () => {
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement<TabProps>(child)) return null;
      const key = getTabKey(child, index);
      const tabId = `${tabsId}-tab-${key}`;
      const panelId = `${tabsId}-tabpanel-${key}`;
      return (
        <Content
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId}
          key={key}
          hidden={key !== activeKeyCurrent}
          className={key !== activeKeyCurrent ? "hidden" : ""}
          grow
          wide
        >
          {child.props.children}
        </Content>
      );
    });
  };

  return (
    <Content
      style={style}
      className={["oakd", "tabs", orientation].join(" ")}
      data-testid="Tabs"
      {...props}
    >
      <Space
        gap
        direction={orientation == "horizontal" ? "vertical" : "horizontal"}
        noWrap
      >
        <ButtonGroup
          direction={orientation}
          role="tablist"
          aria-orientation={orientation}
          onKeyDown={(event) => {
            const tabs = Array.from(
              event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="tab"]',
              ),
            );
            const current = tabs.indexOf(
              document.activeElement as HTMLButtonElement,
            );
            const previousKey =
              orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
            const nextKey =
              orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
            let next = current;
            if (event.key === previousKey) {
              next = (current - 1 + tabs.length) % tabs.length;
            } else if (event.key === nextKey) {
              next = (current + 1) % tabs.length;
            } else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = tabs.length - 1;
            else return;
            event.preventDefault();
            tabs[next]?.focus();
            tabs[next]?.click();
          }}
        >
          {React.Children.map(children, renderTab)}
        </ButtonGroup>
        {renderContent()}
      </Space>
    </Content>
  );
};

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export default Tabs;
