import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Card from "../Atom/Card/Card";
import Paragraph from "../Atom/Paragraph/Paragraph";
import Space from "../Atom/Space/Space";
import Title from "../Atom/Title/Title";
import Col from "../Layout/Column/Column";
import Content from "../Layout/Content/Content";
import Page from "../Layout/Page/Page";
import Row from "../Layout/Row/Row";

type ColorToken = {
  name: string;
  value: string;
};

const collectOakdColorTokens = (): ColorToken[] => {
  const names = new Set<string>();

  const visitRules = (rules: CSSRuleList) => {
    Array.from(rules).forEach((rule) => {
      if ("style" in rule) {
        const style = (rule as CSSStyleRule).style;
        Array.from(style).forEach((property) => {
          if (property.startsWith("--oakd-")) names.add(property);
        });
      }
      if ("cssRules" in rule) {
        visitRules((rule as CSSGroupingRule).cssRules);
      }
    });
  };

  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      visitRules(sheet.cssRules);
    } catch {
      // Storybook can include cross-origin manager stylesheets. OakD's own
      // stylesheet remains readable and is the source used by this story.
    }
  });

  const computed = getComputedStyle(document.documentElement);
  return Array.from(names)
    .map((name) => ({ name, value: computed.getPropertyValue(name).trim() }))
    .filter(({ value }) => value && CSS.supports("color", value))
    .sort((left, right) => left.name.localeCompare(right.name));
};

const groupForToken = (name: string) => {
  if (/^--oakd-card-/.test(name)) return "surface colors";
  if (/^--oakd-(chart|code)-/.test(name)) return "data and code colors";
  if (
    /^--oakd-(default|primary|active|success|warning|danger|ghost|disabled)-/.test(
      name,
    )
  ) {
    return "control colors";
  }
  return "foundation colors";
};

const meta: Meta = {
  title: "Design System/Utilities/Colors & Constants",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const ColorConstants = () => {
      const [tokens, setTokens] = useState<ColorToken[]>([]);

      useEffect(() => {
        setTokens(collectOakdColorTokens());
      }, []);

      const groups = Map.groupBy(tokens, ({ name }) => groupForToken(name));

      return (
        <Page>
          <Content pad wide>
            <Space direction="vertical" gap wide>
              <Title>Colors &amp; Constants</Title>
              <Paragraph>
                Every swatch is read from the active OakD CSS theme. Change the
                theme to inspect its color constants.
              </Paragraph>
              {Array.from(groups.entries()).map(([group, groupTokens]) => (
                <Space key={group} direction="vertical" gap wide>
                  <Title>{group}</Title>
                  <Row gap wide>
                    {groupTokens.map((token) => (
                      <Col key={token.name} xs={24} md={12} lg={8} xl={6}>
                        <Card pad wide>
                          <Space direction="vertical" gap wide>
                            <Card
                              pad
                              wide
                              style={{ backgroundColor: `var(${token.name})` }}
                            >
                              <Paragraph>&nbsp;</Paragraph>
                            </Card>
                            <Paragraph>
                              <strong>{token.name}</strong>
                            </Paragraph>
                          </Space>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Space>
              ))}
            </Space>
          </Content>
        </Page>
      );
    };

    return <ColorConstants />;
  },
};
