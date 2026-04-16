import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Page from "./Page";
import Content from "../Content/Content";
import Row from "../Row/Row";
import { Col } from "../Column/Column";
import Space from "../../Atom/Space/Space";
import Card from "../../Atom/Card/Card";
import Paragraph from "../../Atom/Paragraph/Paragraph";

describe("Page Component", () => {
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

  it("supports a grow body hosting a bounded primary and support workspace", () => {
    render(
      <div style={{ width: 1280, height: 720 }}>
        <Page gap fill>
          <Content>
            <Paragraph>Header</Paragraph>
          </Content>
          <Content grow fill>
            <Row gap fill>
              <Col xs={24} md={14}>
                <Content grow fill>
                  <Space direction="vertical" gap wide fill>
                    <Paragraph>Primary panel</Paragraph>
                    <Paragraph>Summary</Paragraph>
                    <Card wide grow fill aria-label="Primary workspace body">
                      <Paragraph>Workspace body</Paragraph>
                    </Card>
                  </Space>
                </Content>
              </Col>
              <Col xs={24} md={10}>
                <Content grow fill>
                  <Space direction="vertical" gap wide fill>
                    <Paragraph>Support</Paragraph>
                    <Card pad wide grow fill aria-label="Support workspace body">
                      <Paragraph>Support body</Paragraph>
                    </Card>
                  </Space>
                </Content>
              </Col>
            </Row>
          </Content>
          <Content>
            <Paragraph>Footer</Paragraph>
          </Content>
        </Page>
      </div>,
    );

    expect(screen.getByTestId("Page")).toHaveClass("fill");
    expect(screen.getByTestId("Row")).toHaveClass("fill");
    expect(screen.getByRole("region", { name: "Primary workspace body" })).toHaveClass("grow");
    expect(screen.getByRole("region", { name: "Primary workspace body" })).toHaveClass("fill");
    expect(screen.getByRole("region", { name: "Support workspace body" })).toHaveClass("grow");
    expect(screen.getByRole("region", { name: "Support workspace body" })).toHaveClass("fill");
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
