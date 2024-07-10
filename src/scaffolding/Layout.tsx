import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import './Layout.css';

export interface LayoutProps {
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
}

export interface RowProps {
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
}

export interface ColProps {
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

export interface SpaceProps {
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    direction?: 'horizontal' | 'vertical';
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
    wrap?: boolean;
}

export interface CardProps extends SpaceProps {
    wide?: boolean;
    fill?: boolean;
}

export interface TextProps {
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    muted?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export interface LinkProps {
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    href: string;
    span?: boolean;
    onClick?: (e?: any) => void;
}

export interface ButtonProps {
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    onClick?: any;
    buttonType?: 'button' | 'submit' | 'reset';
    type?: 'default' | 'primary' | 'ghost' | 'danger' | 'warning' | 'disabled' | 'link';
    size?: 'small' | 'normal' | 'large';
    href?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export interface InputProps {
    className?: string;
    style?: CSSProperties;
    type: 'text' | 'password' | 'email';
    placeholder: string;
    value?: string;
    onChange?: (e: any) => void;
    grow?: boolean;
    error?: boolean;
    notification?: React.ReactNode;
    disabled?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ className = '', style, children }) => (
    <div className={`layout ${className}`} style={style}>
        {children}
    </div>
);

export const Row: React.FC<RowProps> = ({ className = '', style, children, justify = 'start', align = 'start' }) => (
    <div className={`row justify-${justify} align-${align} ${className}`} style={style}>
        {children}
    </div>
);

const getColClasses = (props: ColProps): string => {
    const classes: string[] = [];
    const breakpoints = { xs: props.xs, sm: props.sm, md: props.md, lg: props.lg, xl: props.xl };

    Object.entries(breakpoints).forEach(([breakpoint, value]) => {
        if (value !== undefined) {
            classes.push(`${breakpoint}-${value}`);
        }
    });

    return classes.join(' ');
};

export const Col: React.FC<ColProps> = ({ className = '', style, children, ...props }) => {
    const colClasses = getColClasses(props);
    return (
        <div className={`col ${colClasses} ${className}`} style={style}>
            {children}
        </div>
    );
};

export const Space: React.FC<SpaceProps> = ({ className = '', style, size = 'medium', direction = 'horizontal', justify, align, wrap, children }) => (
    <div className={`space space-${size} ${direction} ${justify ? `justify-${justify}` : ''} ${align ? `align-${align}` : ''} ${wrap ? 'wrap' : ''} ${className}`} style={style}>
        {children}
    </div>
);

export const Card: React.FC<CardProps> = ({ className = '', style, size = 'medium', direction = 'horizontal', justify, align, wrap, wide, fill, children }) => (
    <div className={`card space-${size} ${direction} ${justify ? `justify-${justify}` : ''} ${align ? `align-${align}` : ''} ${wrap ? 'wrap' : ''} ${wide ? 'wide' : ''} ${fill ? 'fill' : ''} ${className}`} style={style}>
        {children}
    </div>
);

export const Text: React.FC<TextProps> = ({ className = '', style, children, muted, size }) => (
    <span className={`text ${muted ? 'muted' : ''} ${size}`} style={style}>
        {children}
    </span>
);

export const Link: React.FC<LinkProps> = ({ className = '', style, children, href, span, onClick }) => {
    return span ? (
        <span onClick={(e) => {
            if (href.startsWith('http')) {
                window.location.href = href;
                return;
            }
            e.preventDefault();
            if (onClick) {
                onClick(e);
            }
        }} className={`link ${className}`} style={style}>
            {children}
        </span>
    ) : (
        <a href={href} onClick={(e) => {
            if (href.startsWith('http')) {
                window.location.href = href;
                return;
            }
            e.preventDefault();
            if (onClick) {
                onClick(e);
            }
        }} className={`link ${className}`} style={style}>
            {children}
        </a>
    );
};

export const Button: React.FC<ButtonProps> = ({ className = '', style, children, onClick, buttonType = 'button', type = 'default', size, href, icon, disabled }) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (disabled) return;
        if (href) {
            if (href.startsWith('http')) {
                window.location.href = href;
                return;
            }
            event.preventDefault();
        }
        if (onClick) {
            onClick();
        }
    };

    return (
        <button style={style} className={`button ${type} ${size} ${className}`} onClick={handleClick} type={buttonType} disabled={disabled}>
            {icon && <span className="icon">{icon}</span>}
            {children}
        </button>
    );
};

export const Input: React.FC<InputProps> = ({ className = '', style, type, placeholder, value, onChange, grow, error, notification, disabled }) => (
    <div className="input-wrapper" style={style}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`input ${grow ? 'grow' : ''} ${error ? 'error' : ''} ${className}`} disabled={disabled} />
        {notification && <span className="notification">{notification}</span>}
    </div>
);

export const Content: React.FC<LayoutProps> = ({ className = '', style, children }) => (
    <div className={`content ${className}`} style={style}>
        {children}
    </div>
);

export const Pill: React.FC<TextProps> = ({ className = '', style, children, muted, size }) => (
    <span className={`pill ${muted ? 'muted' : ''} ${size}`} style={style}>
        {children}
    </span>
);

export const Page: React.FC<LayoutProps> = ({ className = '', style, children }) => (
    <div className={`page ${className}`} style={style}>
        {children}
    </div>
);

export const Divider: React.FC<TextProps> = ({ className = '', style, children }) => (
    <div className={`divider ${className}`} style={style}>
        {children}
    </div>
);

export const Paragraph: React.FC<TextProps> = ({ className = '', style, children, muted, size }) => (
    <p className={`paragraph ${muted ? 'muted' : ''} ${size}`} style={style}>
        {children}
    </p>
);

export const Title: React.FC<TextProps> = ({ className = '', style, children, muted, size }) => (
    <h1 className={`title ${muted ? 'muted' : ''} ${size}`} style={style}>
        {children}
    </h1>
);
