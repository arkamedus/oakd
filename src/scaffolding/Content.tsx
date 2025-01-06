import React, {CSSProperties} from 'react';
import './Content.css';
import './Grid.css';
import {useNavigate} from "react-router-dom";

export interface RowProps {
    Pad?: boolean;
    style?: any;
    children?: React.ReactNode;
    className?: string;
    Gap?: boolean;
    GapSm?: boolean;
    Fill?: boolean;
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
}

export interface ColProps {
    id?:string;
    style?: any;
    span?: number; // How many of 24 parts the column occupies
    offset?: number; // Left margin of the column (number of parts)
    xs?: number; // Number of parts on extra small screens
    sm?: number; // Number of parts on small screens
    md?: number; // Number of parts on medium screens
    lg?: number; // Number of parts on large screens
    xl?: number; // Number of parts on extra large screens
    children?: React.ReactNode;
    className?: string;
    align?: undefined | "right";
}

export interface DefaultLayoutOptionProps {
    id?: string;
    style?: any;
    children?: React.ReactNode;
    Wide?: boolean;
    Grow?: boolean;
    Center?: boolean;
    Pad?: boolean;
    Muted?: boolean;
    transparent?: boolean;
    className?: string;
}

export interface SpaceLayoutOptionProps extends DefaultLayoutOptionProps {
    Gap?: boolean;
    Pad?: boolean;
    GapSm?: boolean;
    Wrap?: boolean;
    AlignCenter?: boolean;
    Stretch?:boolean;
    Center?: boolean;
    NoWrap?:boolean;
    Fill?: boolean;
    Full?: boolean;
    Column?: boolean;
    direction?: 'horizontal' | 'vertical';
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
}

export const Content: React.FC<DefaultLayoutOptionProps> = ({
                                                                children,
                                                                style,
                                                                Pad,
                                                                Wide,
                                                                transparent,
                                                                className,
                                                                Muted,
                                                                Center,
                                                                Grow
                                                            }) => {
    return (
        <div style={{...style}} className={["content", className,
            Muted ? "Muted" : '',
            Grow ? "grow" : '',
            Pad ? "pad" : '',
            Center ? "center" : '',
            Wide ? "wide" : '',
            transparent ? "transparent" : ''
        ].join(" ")}>
            {children}
        </div>
    );
};

export const Space: React.FC<SpaceLayoutOptionProps> = ({
                                                            children,
                                                            direction = 'horizontal',
                                                            justify = 'start',
                                                            align = 'start',
                                                            className,
                                                            id,
                                                            Gap,
    Fill,
    Full,
    Stretch,
    NoWrap,
                                                            GapSm,
                                                            Pad,
                                                            style
                                                        }) => {
    const spaceClassName = `space space-${direction} justify-${justify} align-${align} ${(Fill ? "fill" : "")} ${(Stretch ? "stretch" : "")} ${(Full ? "full" : "")} ${Gap ? "gap" : ""} ${GapSm ? "gap-sm" : ""} ${Pad ? "pad" : ""} ${(NoWrap ? "no-wrap" : "")} ${className || ''}`;
    return <div id={id} style={style} className={spaceClassName}>{children}</div>;
};

export const Card: React.FC<SpaceLayoutOptionProps> = ({
                                                           children,

                                                           justify = 'start',
                                                           align = 'start',
                                                           className,
                                                           id,
                                                           Gap,
                                                           GapSm,
                                                           Pad,
    Wide,
                                                           Fill,
                                                           Full,
                                                           style
                                                       }) => {
    const spaceClassName = `card ${(Fill ? "fill" : "")} ${(Full ? "full" : "")} ${(Wide ? "wide" : "")} ${(Gap ? "gap" : "")} ${(GapSm ? "gap-sm" : "")} ${Pad ? "pad" : ""} ${className || ''}`;
    return <div id={id} style={style} className={spaceClassName}>{children}</div>;
};

export const Small: React.FC<SpaceLayoutOptionProps> = ({
                                                            children,
                                                            style,
                                                            Wide,
                                                            transparent,
                                                            className,
                                                            Gap,
                                                            GapSm,
                                                            AlignCenter,
                                                            Muted
                                                        }) => {
    return (
        <span style={{...style}}
              className={["text small", className, Muted ? "muted" : '', Gap ? "gap" : '', GapSm ? "gap-sm" : '', AlignCenter ? "align-center" : '', Wide ? "wide" : '', transparent ? "transparent" : ''].join(" ")}>
            {children}
        </span>
    );
};

export const Text: React.FC<SpaceLayoutOptionProps> = ({
                                                            children,
                                                            style,
                                                            Wide,
                                                            transparent,
                                                            className,
                                                            Gap,
                                                            AlignCenter,
                                                            Muted
                                                        }) => {
    return (
        <span style={{...style}}
              className={["text", className, Muted ? "Muted" : '', Gap ? "gap" : '', AlignCenter ? "align-center" : '', Wide ? "Wide" : '', transparent ? "Transparent" : ''].join(" ")}>
            {children}
        </span>
    );
};

export const Pill: React.FC<SpaceLayoutOptionProps> = ({
                                                           children,
                                                           style,
                                                           Wide,
                                                           transparent,
                                                           className,
                                                           Gap,
                                                           AlignCenter,
                                                           Muted
                                                       }) => {
    return (
        <span style={{...style}}
              className={["text pill", className, Muted ? "Muted" : '', Gap ? "gap" : '', AlignCenter ? "AlignCenter" : '', Wide ? "Wide" : '', transparent ? "Transparent" : ''].join(" ")}>
            {children}
        </span>
    );
};

export const Row: React.FC<RowProps> = ({
                                            children,
                                            style,
                                            Pad,
                                            Fill,
                                            className,
                                            Gap,
                                            GapSm,
                                            justify = "start",
                                            align = "start"
                                        }) => {

    const rowClassName = `row justify-${justify} align-${align} ${Gap ? "gap" : ""} ${GapSm ? "gap-sm" : ""} ${Fill ? "fill" : ""} ${Pad ? "pad" : ""} ${className || ''}`;


    return (
        <div style={{...style}} className={rowClassName}>
            {children}
        </div>
    );
};

export const Col: React.FC<ColProps> = ({children, align, style, span, offset, xs, sm, md, lg, xl, className}) => {
    let classNames = ['col'];
    if (span) classNames.push(`span-${span}`);
    if (xs) classNames.push(`xs-${xs}`);
    if (sm) classNames.push(`sm-${sm}`);
    if (md) classNames.push(`md-${md}`);
    if (lg) classNames.push(`lg-${lg}`);
    if (xl) classNames.push(`xl-${xl}`);
    if (align) {
        if (align == "right") {
            classNames.push("align-right");
        }
    }
    if (className) classNames.push(className);

    return (
        <div style={{...style}} className={classNames.join(' ')}>
            {children}
        </div>
    );
};

export interface LayoutProps {
    children: React.ReactNode;
    style?: any
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({children, style, className}) => {
    return (
        <div className={["layout", className].join(" ")} style={style}>
            {children}
        </div>
    );
};

export const Page: React.FC<DefaultLayoutOptionProps> = ({children, id, style, Wide, transparent, Grow, className}) => {
    return (
        <div id={id} style={{...style}}
             className={["page", className, Wide ? "wide" : '', Grow ? "grow" : '', transparent ? "transparent" : ''].join(" ")}>
            {children}
        </div>
    );
};

interface BaseProps {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

interface TextProps extends BaseProps {
    Muted?: boolean;
    size?: 'large';
}


interface TitleProps {
    children: React.ReactNode;
    className?: string;
    size?: any;
    Large?: boolean;
    Muted?: boolean;
    style?: CSSProperties;

}

export const Divider: React.FC<BaseProps> = ({className, children}) => {
    return <div className={`${className} divider`}>{children}</div>;
};

export const Spacer: React.FC<BaseProps> = ({children}) => {
    return <div className="spacer">{children}</div>;
};

export const Paragraph: React.FC<TextProps> = ({children, className, Muted, size}) => {
    const classNames = [
        "text",
        className,
        Muted ? "Muted" : "",
        size === "large" ? "Lg" : ""
    ].filter(Boolean).join(" ");

    return <p className={classNames}>{children}</p>;
};

export const Title: React.FC<TitleProps> = ({children, style, className, size, Large, Muted}) => {
    const classNames = [
        "title",
        className,
        Large ? "Lg" : "",
        Muted ? "Muted" : ""
    ].filter(Boolean).join(" ");

    return <h1 style={style} className={classNames}>{children}</h1>;
};




interface LinkProps {
    children: React.ReactNode;
    href: string;
    className?: string;
    style?: CSSProperties;
    span?: boolean;
    onClick?:(e?:any)=>void;
}

export const Link: React.FC<LinkProps> = ({style, span, children, href, className, onClick}) => {
    const navigate = useNavigate();
    return (span ?
            <span onClick={(e) => {
                if (href.startsWith("http")) {
                    window.location.href = href;
                    return
                }
                    e.preventDefault();
                    if (onClick) {
                        return onClick(e);
                    }
                    navigate(href);

            }} className={`link ${className || ''}`} style={style}>{children}</span> : <a href={href} onClick={(e) => {
                if (href.startsWith("http")) {
                    window.location.href = href;
                    return
                }
                    e.preventDefault();
                    if (onClick) {
                        return onClick(e);
                    }
                    navigate(href);

            }} className={`Link ${className || ''}`} style={style}>{children}</a>
    );
};

export type ButtonType = 'default' | 'primary' | 'ghost' | 'danger' | 'warning' | 'disabled' | 'like' | 'link';
export type ButtonSize = 'small' | 'normal' | 'large';

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: any;
    buttonType?: 'button' | 'submit' | 'reset';
    type?: ButtonType;
    size?: ButtonSize;
    style?: CSSProperties;
    className?: string;
    href?: string; // Optional link
    icon?: React.ReactNode; // FontAwesome icon definition
    listeners?: any;
    attributes?: any;
}

interface InputProps {
    type: "text" | "password" | "email";
    placeholder: string;
    className?: string;
    id?:string;
    name?:string;
    style?: CSSProperties;
    Grow?: boolean;
    icon?: React.ReactNode; // FontAwesome icon definition
    notification?: React.ReactNode; // FontAwesome icon definition
    Error?: boolean;
    value?:string;
    onChange?:(e:any)=>void;
}

export const Input: React.FC<InputProps> = ({id, name, style, value, notification,onChange, className, type, placeholder, Grow, Error}) => {
    const classNames = [
        "input",
        className,
        Error?"error":"",
        Grow ? "grow" : ""
    ].filter(Boolean).join(" ");
    return (
        <div className={"input-wrapper"}><input id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={classNames}/>{notification&&(<span className={"error-icon"}>{notification}</span>)}</div>
    );
};

export const Button: React.FC<ButtonProps> = ({
                                                  listeners, attributes,
                                                  children,
                                                  onClick,
    style,
                                                  buttonType = 'button',
                                                  type = 'default',
                                                  size = '',
                                                  className = '',
                                                  href,
                                                  icon
                                              }) => {
    const navigate = useNavigate();

    const active = href && href === window.location.pathname;

    const classNames = `Button ${type} ${size === "large" ? "lg" : ""} ${size === "small" ? "small" : ""} ${className} ${active ? "active" : ""}`.trim();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        if (href) {
            if (href.startsWith("http")) {
                    window.location.href = href;
                return
            }

                event.preventDefault();
                navigate(href);

        }
        if (onClick) {
            onClick();
        }
    };

    if (type === 'disabled') {
        return (
            <button style={style} className={classNames} type={buttonType} disabled  {...listeners} {...attributes}>
                <Space align={"center"} justify={"center"} GapSm>{icon}
                    {children}</Space>
            </button>
        );
    }

    return (
        <button style={style} className={classNames} onClick={handleClick} type={buttonType} {...listeners} {...attributes}>
            <Space align={"center"} justify={"center"} GapSm>{icon}
                {children}</Space>
        </button>
    );
};
