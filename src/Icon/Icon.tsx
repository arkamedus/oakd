import React, {ReactNode} from "react";
import {IconProps} from "./Icon.types";

import IAngle from "./asset/oakd_IconAngle.svg";
import IApps from "./asset/oakd_IconApps.svg";
import IArrow from "./asset/oakd_IconArrow.svg";
import IBar from "./asset/oakd_IconBar.svg";
import ICheck from "./asset/oakd_IconCheck.svg";
import IClock from "./asset/oakd_IconClock.svg";
import ICircle from "./asset/oakd_IconCircle.svg";
import IComment from "./asset/oakd_IconComment.svg";
import IDiamond from "./asset/oakd_IconDiamond.svg";
import IFolder from "./asset/oakd_IconFolder.svg";
import IList from "./asset/oakd_IconList.svg";
import IMagnify from "./asset/oakd_IconMagnify.svg";
import IOctagon from "./asset/oakd_IconOctagon.svg";
import IPenPaper from "./asset/oakd_IconPenPaper.svg";
import IPlus from "./asset/oakd_IconPlus.svg";
import IRefresh from "./asset/oakd_IconRefresh.svg";
import IShare from "./asset/oakd_IconShare.svg";
import ISliders from "./asset/oakd_IconSliders.svg";
import ISquare from "./asset/oakd_IconSquare.svg";
import IStar from "./asset/oakd_IconStar.svg";
import IText from "./asset/oakd_IconText.svg";
import ITrash from "./asset/oakd_IconTrash.svg";
import ITriangle from "./asset/oakd_IconTriangle.svg";
import IUser from "./asset/oakd_IconUser.svg";
import IX from "./asset/oakd_IconX.svg";

const iconMap: Record<string, string> = {
    Angle: IAngle,
    Apps: IApps,
    Arrow: IArrow,
    Bar: IBar,
    Check: ICheck,
    Circle: ICircle,
    Clock: IClock,
    Comment: IComment,
    Diamond: IDiamond,
    Folder: IFolder,
    List: IList,
    Magnify: IMagnify,
    Octagon: IOctagon,
    PenPaper: IPenPaper,
    Plus: IPlus,
    Refresh: IRefresh,
    Share: IShare,
    Sliders: ISliders,
    Square: ISquare,
    Star: IStar,
    Text: IText,
    Trash: ITrash,
    Triangle: ITriangle,
    User: IUser,
    X: IX,
};

import "./Icon.css";

const Icon: React.FC<IconProps> = ({ name, style, size = "default", className = "", ...props }) => {
    const IconSrc = iconMap[name];
    if (!IconSrc) {
        console.warn(`Icon "${name}" not found.`);
        return null;
    }
    // Extract URL string from the import (handles default export if present)
    const iconUrl = typeof IconSrc === "string" ? IconSrc : "X" || IconSrc;
    const iconStyle = {
        ...style,
        backgroundColor: style?.color || "currentColor",
        mask: `url(${iconUrl}) no-repeat center/contain`,
        WebkitMask: `url(${iconUrl}) no-repeat center/contain`,
    };

    return <div className={`oakd icon icon-${size} ${className}`} style={iconStyle} {...props} />;
};


export default Icon;

interface IconStackProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const IconStack: React.FC<IconStackProps> = ({children, className = "", style}) => (
    <div className={`oakd-icon-stack ${className}`} style={style}>
        {React.Children.map(children, (child) => (
            <div className="oakd-icon-stack__item">{child}</div>
        ))}
    </div>
);


export const IconAngle = (props: Omit<IconProps, "name">) => <Icon name="Angle" {...props} />;
export const IconApps = (props: Omit<IconProps, "name">) => <Icon name="Apps" {...props} />;
export const IconArrow = (props: Omit<IconProps, "name">) => <Icon name="Arrow" {...props} />;
export const IconBar = (props: Omit<IconProps, "name">) => <Icon name="Bar" {...props} />;
export const IconCheck = (props: Omit<IconProps, "name">) => <Icon name="Check" {...props} />;
export const IconCircle = (props: Omit<IconProps, "name">) => <Icon name="Circle" {...props} />;
export const IconClock = (props: Omit<IconProps, "name">) => <Icon name="Clock" {...props} />;
export const IconComment = (props: Omit<IconProps, "name">) => <Icon name="Comment" {...props} />;
export const IconDiamond = (props: Omit<IconProps, "name">) => <Icon name="Diamond" {...props} />;
export const IconFolder = (props: Omit<IconProps, "name">) => <Icon name="Folder" {...props} />;
export const IconList = (props: Omit<IconProps, "name">) => <Icon name="List" {...props} />;
export const IconMagnify = (props: Omit<IconProps, "name">) => <Icon name="Magnify" {...props} />;
export const IconOctagon = (props: Omit<IconProps, "name">) => <Icon name="Octagon" {...props} />;
export const IconPlus = (props: Omit<IconProps, "name">) => <Icon name="Plus" {...props} />;
export const IconRefresh = (props: Omit<IconProps, "name">) => <Icon name="Refresh" {...props} />;
export const IconShare = (props: Omit<IconProps, "name">) => <Icon name="Share" {...props} />;
export const IconSliders = (props: Omit<IconProps, "name">) => <Icon name="Sliders" {...props} />;
export const IconSquare = (props: Omit<IconProps, "name">) => <Icon name="Square" {...props} />;
export const IconStar = (props: Omit<IconProps, "name">) => <Icon name="Star" {...props} />;
export const IconText = (props: Omit<IconProps, "name">) => <Icon name="Text" {...props} />;
export const IconTrash = (props: Omit<IconProps, "name">) => <Icon name="Trash" {...props} />;
export const IconTriangle = (props: Omit<IconProps, "name">) => <Icon name="Triangle" {...props} />;
export const IconUser = (props: Omit<IconProps, "name">) => <Icon name="User" {...props} />;
export const IconX = (props: Omit<IconProps, "name">) => <Icon name="X" {...props} />;
