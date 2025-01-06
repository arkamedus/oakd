import {Button, Card, Content, Link, Paragraph, Space, Title} from "./Content";
import "./Defaults.css";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faInbox,
    faSpinner,
    faTriangleExclamation,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";


// Breadcrumb Component
const Breadcrumb = ({ items }: { items: React.ReactNode[] }) => (
    <Space direction="horizontal" GapSm>
        {items.map((item, index) => (
            <Space GapSm key={index}>
                <Link href={`#TODO`}>{item}</Link>
                {index < items.length - 1 && <span> <span className={"Muted"}>&gt;</span> </span>}
            </Space>
        ))}
    </Space>
);

// Pagination Component
const Pagination = ({ current, total, onChange }: { current: number; total: number; onChange: (page: number) => void }) => (
    <Space direction="horizontal" GapSm>
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
const Empty = ({ description }: { description: string }) => (
    <Card className="empty">
        <Paragraph><FontAwesomeIcon icon={faInbox} /> {description}</Paragraph>
    </Card>
);

// Empty Component
const Loading = ({ description="Loading" }: { description?: string }) => (
    <Card className="empty">
        <Paragraph><FontAwesomeIcon spinPulse fixedWidth icon={faSpinner} /> {description}</Paragraph>
    </Card>
);

// Empty Component
const Announcement = ({ children, onClose }: { children: React.ReactNode, onClose?:any }) => (
    <div className="announcement pad-sm">
        <Space justify={"space-between"} align={"center"} Gap NoWrap>
            <Paragraph>{children}</Paragraph><FontAwesomeIcon onClick={()=>{
                if (onClose){onClose()}
        }} fixedWidth className={"icon"} icon={faXmark} />
        </Space>
    </div>
);

// List Component
const List = ({ items }: { items: string[] }) => (
    <Content>
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </Content>
);

// Segmented Component
const Segmented = ({ options, onChange }: { options: string[]; onChange: (option: string) => void }) => (
    <Space direction="horizontal" Gap>
        {options.map((option, index) => (
            <Button key={index} onClick={() => onChange(option)}>
                {option}
            </Button>
        ))}
    </Space>
);

// Statistic Component
const Statistic = ({ title, value }: { title: React.ReactNode; value: React.ReactNode }) => (
    <Space direction={"vertical"} GapSm>
        <Title Muted>{title}</Title>
        <Title Large>{value}</Title>
    </Space>
);

// Tabs Component
const Tabs = ({ tabs, activeTab, onTabChange }: { tabs: string[]; activeTab: string; onTabChange: (tab: string) => void }) => (
    <Space direction="horizontal" Gap>
        {tabs.map((tab, index) => (
            <Button key={index} type={tab === activeTab ? 'primary' : 'default'} onClick={() => onTabChange(tab)}>
                {tab}
            </Button>
        ))}
    </Space>
);

// Result Component
const Result = ({ status, title, subTitle, extra }: { status: 'success' | 'error'; title: React.ReactNode; subTitle: string; extra?: React.ReactNode }) => (
    <Card className={`result result-${status}`}>
        <Content Pad Center>
        <Space direction={"vertical"} align={"center"} GapSm>
            <Title Large>{status==="error"?<FontAwesomeIcon className={status} icon={faTriangleExclamation} />:<FontAwesomeIcon className={status} icon={faCircleCheck}/>} {title}</Title>
        <Paragraph>{subTitle}</Paragraph>
        {extra}
        </Space>
        </Content>
    </Card>
);

// Modal Component
const Modal = ({ visible, title, content, onClose }: { visible: boolean; title: React.ReactNode; content: React.ReactNode; onClose: () => void }) => (
    visible ? (
        <div className="modal-container" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <Space direction={"vertical"} GapSm>
                <Space justify={"space-between"} NoWrap align={"center"} Gap>
                    <Title>{title}</Title>
                    <Button type="default" onClick={()=>{
                        if (onClose){onClose()}
                    }}><FontAwesomeIcon fixedWidth className={"icon"} icon={faXmark} /></Button>
                </Space>
                <Space direction={"vertical"} GapSm>
                <Paragraph>{content}</Paragraph>
                </Space>
                </Space>
            </div>
        </div>
    ) : null
);

// Drawer Component
const Drawer = ({ visible, title, content, onClose }: { visible: boolean; title: React.ReactNode; content: React.ReactNode; onClose: () => void }) => (
    visible ? (
        <div className="drawer-container" onClick={onClose}>
            <div className="drawer" onClick={e => e.stopPropagation()}>
                <Space direction={"vertical"} GapSm>
                <Title>{title}</Title>
                <Paragraph>{content}</Paragraph>
                <Button type="primary" onClick={onClose}>Close</Button>
                </Space>
            </div>
        </div>
    ) : null
);


// Skeleton Component
const Skeleton = ({ rows, width }: { rows: number, width?:number }) => (
    <div className="skeleton" style={width?{width:`${width}em`}:{}}>
        {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="skeleton-gradient">&nbsp;</div>
        ))}
    </div>
);

interface InlineIconProps {
    children?: React.ReactNode;
}

export const InlineIcon: React.FC<InlineIconProps> = ({children}) => {
    return (
        <span className={`inline-icon`}>
            {children}
        </span>
    );
};

interface InlineImageProps {
    src: string;
}

export const InlineImage: React.FC<InlineImageProps> = ({src}) => {
    return (
        <div className={`inline`}>
            <img className={"round"} src={src}/>
        </div>
    );
};

interface TooltipProps {
    message: React.ReactNode;
    children: React.ReactNode;
}


interface CircleElementProps {
    imageSrc: string;
    altText: string;
    onClick?: () => void;
}

const ScrollableElement: React.FC<CircleElementProps> = ({ imageSrc, altText, onClick }) => {
    return (
        <div className={"scrollable-element"} onClick={onClick}>
        <div className="circle-element">
            <img src={imageSrc} alt={altText} />
        </div>
            <p>{altText}</p>
        </div>
    );
};

interface ScrollableContainerProps {
    children: React.ReactNode;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ children }) => {
    return (

        <div className="scrollable-container">
            {children}
        </div>
    );
};


interface Option<T> {
    element: React.ReactNode;
    value: T;
}

interface SelectProps<T> {
    options: Option<T>[];
    defaultValue?: T;
    placeholder?: React.ReactNode | string;
    onSelected: (value: T) => void;
}

export {
    Breadcrumb,
    Pagination,
    Empty,
    Loading,
    List,
    Segmented,
    Statistic,
    Tabs,
    Result,
    Modal,
    Drawer,
    Skeleton,
    ScrollableContainer,
    ScrollableElement,
    Announcement
};