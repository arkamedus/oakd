import React from "react";
import { render, screen } from "@testing-library/react";
import Page from "./Page";

describe("Page Component", () => {
    it("renders children correctly", () => {
        render(<Page><div>Test Child</div></Page>);
        expect(screen.getByText(/Test Child/i)).toBeInTheDocument();
    });

    it("applies fixed class when fixed prop is true", () => {
        render(<Page fixed><div>Fixed Page</div></Page>);
        expect(screen.getByText(/Fixed Page/i).parentElement).toHaveClass("fixed");
    });

    it("applies gap class when gap prop is true", () => {
        render(<Page gap><div>Gapped Page</div></Page>);
        expect(screen.getByText(/Gapped Page/i).parentElement).toHaveClass("gap");
    });

    it("supports additional class names", () => {
        render(<Page className="custom-class"><div>Custom Class</div></Page>);
        expect(screen.getByText(/Custom Class/i).parentElement).toHaveClass("custom-class");
    });
});
