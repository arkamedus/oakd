import React, { useEffect, useRef, useState, CSSProperties } from 'react';
import { Button, Card, Content, Link, Paragraph, Space, Title } from './Layout';
import './Defaults.css';

// Breadcrumb Component
export const Breadcrumb: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
    <Space direction="horizontal">
        {items.map((item, index) => (
            <Space key={index}>
                <Link href={`#TODO`}>{item}</Link>
                {index < items.length - 1 && <span><span className="muted"> &posent; </span></span>}
            </Space>
        ))}
    </Space>
);

// Pagination Component
export const Pagination: React.FC<{ current: number; total: number; onChange: (page: number) => void }> = ({ current, total, onChange }) => (
    <Space direction="horizontal">
        {Array.from({ length: total }, (_, index) => (
            <Button
                key={index}
                type={index + 1 === current ? 'primary' : 'default'}
                onClick={() => onChange(index + 1)}
            >
                {index + 1}
            </Button>
        ))}
    </Space>
);

// Empty Component
export const Empty: React.FC<{ description: string; icon?: React.ReactNode }> = ({ description, icon }) => (
    <Card className="empty">
        <Paragraph>{icon} {description}</Paragraph>
    </Card>
);

// Loading Component
export const Loading: React.FC<{ description?: string; icon?: React.ReactNode }> = ({ description = 'Loading', icon }) => (
    <Card className="empty">
        <Paragraph>{icon} {description}</Paragraph>
    </Card>
);

// Announcement Component
export const Announcement: React.FC<{ children: React.ReactNode; onClose?: () => void; icon?: React.ReactNode }> = ({ children, onClose, icon }) => (
    <div className="announcement PadSm">
        <Space justify="space-between" align="center" >
            <Paragraph>{children}</Paragraph>
            {icon && <span onClick={onClose} className="icon">{icon}</span>}
        </Space>
    </div>
);

// List Component
export const List: React.FC<{ items: string[] }> = ({ items }) => (
    <Content>
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </Content>
);

// Segmented Component
export const Segmented: React.FC<{ options: string[]; onChange: (option: string) => void }> = ({ options, onChange }) => (
    <Space direction="horizontal">
        {options.map((option, index) => (
            <Button key={index} onClick={() => onChange(option)}>
                {option}
            </Button>
        ))}
    </Space>
);

// Statistic Component
export const Statistic: React.FC<{ title: React.ReactNode; value: React.ReactNode; icon?: React.ReactNode }> = ({ title, value, icon }) => (
    <Space direction="vertical">
        <Title>{title} {icon}</Title>
        <Title>{value}</Title>
    </Space>
);

// Tabs Component
export const Tabs: React.FC<{ tabs: string[]; activeTab: string; onTabChange: (tab: string) => void }> = ({ tabs, activeTab, onTabChange }) => (
    <Space direction="horizontal">
        {tabs.map((tab, index) => (
            <Button key={index} type={tab === activeTab ? 'primary' : 'default'} onClick={() => onTabChange(tab)}>
                {tab}
            </Button>
        ))}
    </Space>
);

// Result Component
export const Result: React.FC<{ status: 'success' | 'error'; title: React.ReactNode; subTitle: string; extra?: React.ReactNode; icon?: React.ReactNode }> = ({ status, title, subTitle, extra, icon }) => (
    <Card className={`result result-${status}`}>
        <Content>
            <Space direction="vertical" align="center">
                <Title>{icon} {title}</Title>
                <Paragraph>{subTitle}</Paragraph>
                {extra}
            </Space>
        </Content>
    </Card>
);

// Modal Component
export const Modal: React.FC<{ visible: boolean; title: React.ReactNode; content: React.ReactNode; onClose: () => void; icon?: React.ReactNode }> = ({ visible, title, content, onClose, icon }) => (
    visible ? (
        <div className="modal-container" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <Space direction="vertical">
                    <Space justify="space-between" align="center">
                        <Title>{title}</Title>
                        <Button type="default" onClick={onClose}>{icon}</Button>
                    </Space>
                    <Space direction="vertical">
                        <Paragraph>{content}</Paragraph>
                    </Space>
                </Space>
            </div>
        </div>
    ) : null
);

// Drawer Component
export const Drawer: React.FC<{ visible: boolean; title: React.ReactNode; content: React.ReactNode; onClose: () => void }> = ({ visible, title, content, onClose }) => (
    visible ? (
        <div className="drawer-container" onClick={onClose}>
            <div className="drawer" onClick={e => e.stopPropagation()}>
                <Space direction="vertical">
                    <Title>{title}</Title>
                    <Paragraph>{content}</Paragraph>
                    <Button type="primary" onClick={onClose}>Close</Button>
                </Space>
            </div>
        </div>
    ) : null
);

// Skeleton Component
export const Skeleton: React.FC<{ rows: number; width?: number }> = ({ rows, width }) => (
    <div className="skeleton" style={width ? { width: `${width}em` } : {}}>
        {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="skeleton-gradient">&nbsp;</div>
        ))}
    </div>
);

// InlineIcon Component
export const InlineIcon: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <span className="inline-icon">
        {children}
    </span>
);

// InlineImage Component
export const InlineImage: React.FC<{ src: string }> = ({ src }) => (
    <div className="inline">
        <img className="round" src={src} />
    </div>
);

// Tooltip Component
export const Tooltip: React.FC<{ message: React.ReactNode; children: React.ReactNode }> = ({ message, children }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0, arrowX: "50%" });
    const tooltipRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        const containerElement = containerRef.current;
        const tooltipElement = tooltipRef.current;

        if (containerElement && tooltipElement) {
            const containerRect = containerElement.getBoundingClientRect();
            const tooltipWidth = tooltipElement.offsetWidth;
            const tooltipHeight = tooltipElement.offsetHeight;
            const screenWidth = window.innerWidth;

            let x = containerRect.left + containerRect.width / 2 - tooltipWidth / 2;
            let y = containerRect.top - tooltipHeight - 10;

            let arrowX = '50%';

            if (x < 20) {
                arrowX = `${containerRect.left + containerRect.width / 2 - 20}px`;
                x = 20;
            } else if (x + tooltipWidth > screenWidth - 20) {
                arrowX = `${containerRect.left + containerRect.width / 2 - (screenWidth - tooltipWidth - 20)}px`;
                x = screenWidth - tooltipWidth - 20;
            }

            if (y < 0) {
                y = containerRect.bottom + 10;
            }

            setPosition({ x, y, arrowX });
        }
        setVisible(true);
    };

    const hideTooltip = () => setVisible(false);

    useEffect(() => {
        if (visible) {
            const handleScroll = () => setVisible(false);
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [visible]);

    return (
        <div ref={containerRef} className="tooltip-container" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
            {children}
            {visible && (
                <div ref={tooltipRef} className="tooltip" style={{ top: `${position.y}px`, left: `${position.x}px` }}>
                    <div className="tooltip-arrow" style={{ left: position.arrowX }}></div>
                    <div className="tooltip-message">{message}</div>
                </div>
            )}
        </div>
    );
};

// ScrollableElement Component
export const ScrollableElement: React.FC<{ imageSrc: string; altText: string; onClick?: () => void }> = ({ imageSrc, altText, onClick }) => (
    <div className="scrollable-element" onClick={onClick}>
        <div className="circle-element">
            <img src={imageSrc} alt={altText} />
        </div>
        <p>{altText}</p>
    </div>
);

// ScrollableContainer Component
export const ScrollableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="scrollable-container">
        {children}
    </div>
);
