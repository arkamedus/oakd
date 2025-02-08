import React from "react";

import { ContentProps } from "./Content.types";

import "./Content.css";

const Content: React.FC<ContentProps> = ({ foo }) => (
    <div data-testid="Content" className="foo-bar">{foo}</div>
);

export default Content;

