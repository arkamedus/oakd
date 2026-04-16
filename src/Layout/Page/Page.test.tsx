import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Page from "./Page";
import Content from "../Content/Content";
import Row from "../Row/Row";
import { Col } from "../Column/Column";
import Space from "../../Atom/Space/Space";
import Card from "../../Atom/Card/Card";
import Paragraph from "../../Atom/Paragraph/Paragraph";
import MultiLineChart from "../../Atom/MultiLineChart/MultiLineChart";

class ResizeObserverMock {
  observe() {}
  disconnect() {}
}

describe("Page Component", () => {
  beforeEach(() => {
    (global as any).ResizeObserver = ResizeObserverMock;
    Object.defineProperty(HTMLDivElement.prototype, "clientWidth", {
      configurable: true,
      get() {
        const className = this.className?.toString?.() || "";
        if (className.includes("oakd-multi-line-chart__frame")) return 480;
        if (className.includes("oakd-multi-line-chart")) return 480;
        return 0;
      },
    });
    Object.defineProperty(HTMLDivElement.prototype, "clientHeight", {
      configurable: true,
      get() {
        const className = this.className?.toString?.() || "";
        if (className.includes("oakd-multi-line-chart__frame")) return 280;
        if (className.includes("oakd-multi-line-chart")) return 320;
        return 40;
      },
    });
  });

  it("renders children and forwards DOM props", () => {
    const onScroll = jest.fn();
    render(
      <Page onScroll={onScroll}>
        <div>Account settings</div>
      </Page>,
    );

    const page = screen.getByTestId("Page");
    expect(page).toHaveTextContent("Account settings");

    fireEvent.scroll(page);
    expect(onScroll).toHaveBeenCalled();
  });

  it("applies layout modifiers and custom classes", () => {
    render(
      <Page fixed fill gap className="custom-page">
        <div>Layout shell</div>
      </Page>,
    );

    const page = screen.getByText("Layout shell").parentElement;
    expect(page).toHaveClass("fixed");
    expect(page).toHaveClass("fill");
    expect(page).toHaveClass("gap");
    expect(page).toHaveClass("custom-page");
  });

  it("supports fill independently of fixed for bounded layout shells", () => {
    render(
      <div style={{ width: 800, height: 600 }}>
        <Page fill>
          <div>Bounded page</div>
        </Page>
      </div>,
    );

    expect(screen.getByTestId("Page")).toHaveClass("fill");
    expect(screen.getByTestId("Page")).not.toHaveClass("fixed");
  });

  it("supports a grow body hosting a filled analytics chart panel", async () => {
    render(
      <div style={{ width: 1280, height: 720 }}>
        <Page gap>
          <Content>
            <Paragraph>Header</Paragraph>
          </Content>
          <Content grow>
            <Row gap>
              <Col xs={24} md={14}>
                <Content grow fill>
                  <Space direction="vertical" gap wide fill>
                    <Paragraph>Primary panel</Paragraph>
                    <Paragraph>Summary</Paragraph>
                    <Card wide fill>
                      <MultiLineChart
                        fill
                        lines={[
                          {
                            label: "Signups",
                            values: [
                              { x: "2026-04-01", y: 18 },
                              { x: "2026-04-02", y: 24 },
                            ],
                          },
                        ]}
                      />
                    </Card>
                  </Space>
                </Content>
              </Col>
              <Col xs={24} md={10}>
                <Card pad wide>
                  <Paragraph>Support</Paragraph>
                </Card>
              </Col>
            </Row>
          </Content>
          <Content>
            <Paragraph>Footer</Paragraph>
          </Content>
        </Page>
      </div>,
    );

    expect(await screen.findByText("Signups")).toBeInTheDocument();
    expect(screen.getByTestId("MultiLineChartRoot")).toHaveClass("oakd-multi-line-chart--fill");
  });

  it("supports a static page body with an inner scroll region", () => {
    render(
      <div style={{ width: 1280, height: 720 }}>
        <Page gap fill>
          <Content>
            <Paragraph>Header</Paragraph>
          </Content>
          <Content grow fill style={{ minHeight: 0, overflow: "hidden" }}>
            <Row gap fill>
              <Col xs={24} md={6}>
                <Card pad wide>
                  <Paragraph>Contacts</Paragraph>
                </Card>
              </Col>
              <Col xs={24} md={18}>
                <Card pad wide fill>
                  <Content grow fill style={{ minHeight: 0, overflowY: "auto" }}>
                    <Paragraph>Message rail</Paragraph>
                  </Content>
                </Card>
              </Col>
            </Row>
          </Content>
        </Page>
      </div>,
    );

    expect(screen.getByTestId("Page")).toHaveClass("fill");
    expect(screen.getByTestId("Row")).toHaveClass("fill");
    expect(screen.getByText("Contacts").closest("[data-testid='Card']")).not.toHaveClass("fill");
    expect(screen.getByText("Message rail").closest("[data-testid='Content']")).toHaveStyle({
      overflowY: "auto",
    });
  });
});
