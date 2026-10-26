import React, { useMemo, useRef, useState } from "react";
import "./Welcome.css";
import Space from "./Atom/Space/Space";
import Title from "./Atom/Title/Title";
import Paragraph from "./Atom/Paragraph/Paragraph";
import Content from "./Layout/Content/Content";
import Card from "./Atom/Card/Card";
import DebugLayer from "./Atom/DebugLayer/DebugLayer";
import Button, { ButtonGroup } from "./Atom/Button/Button";
import {
  CoreIconNameType,
  IconDots,
  IconHome,
  IconTypes,
} from "./Icon/Icons.bin";
import Icon from "./Icon/Icon";
import Row from "./Layout/Row/Row";
import Column, { Col } from "./Layout/Column/Column";
import Input from "./Atom/Input/Input";
import Select from "./Atom/Select/Select";
import Collapsible from "./Atom/Collapsible/Collapsible";
import CodeArea from "./Atom/CodeArea/CodeArea";
import Dropdown from "./Atom/Dropdown/Dropdown";
import ActionList, { ActionListItem } from "./Atom/ActionList/ActionList";
import Divider from "./Atom/Divider/Divider";
import Breadcrumb from "./Atom/Breadcrumb/Breadcrumb";
import { ButtonType } from "./Core/Core.types";
import Pagination from "./Atom/Pagination/Pagination";
import MultiLineChart from "./Atom/MultiLineChart/MultiLineChart";
import StackedBreakdownChart from "./Atom/StackedBreakdownChart/StackedBreakdownChart";
import Announcement from "./Atom/Announcement/Announcement";
import Tree from "./Atom/Tree/Tree";
import { TreeItem } from "./Atom/Tree/Tree.types";
import ThumbnailSelect from "./Atom/ThumbnailSelect/ThumbnailSelect";
import ColorField from "./Atom/ColorField/ColorField";
import { ColorValue } from "./Atom/ColorField/ColorField.types";
import VectorField from "./Atom/VectorField/VectorField";
import { VectorValue } from "./Atom/VectorField/VectorField.types";
import Pill from "./Atom/Pill/Pill";

const createWelcomeTree = (): TreeItem[] => [
  {
    id: "welcome-root",
    label: <Paragraph>workspace</Paragraph>,
    expanded: true,
    children: [
      {
        id: "welcome-design",
        label: <Paragraph>design</Paragraph>,
        expanded: true,
        children: [
          {
            id: "welcome-banner",
            label: <Paragraph>launch-banner.png</Paragraph>,
            icon: "Picture",
            leaf: (
              <Pill size="small" variant="success">
                <Paragraph>ready</Paragraph>
              </Pill>
            ),
          },
          {
            id: "welcome-copy",
            label: <Paragraph>homepage-copy.md</Paragraph>,
            icon: "Bookmark",
            leaf: (
              <Pill size="small" variant="warning">
                <Paragraph>draft</Paragraph>
              </Pill>
            ),
          },
        ],
      },
      {
        id: "welcome-notes",
        label: <Paragraph>notes</Paragraph>,
        expanded: true,
        children: [
          {
            id: "welcome-review",
            label: <Paragraph>review-checklist.txt</Paragraph>,
            icon: "File",
            leaf: (
              <Pill size="small" variant="primary">
                <Paragraph>review</Paragraph>
              </Pill>
            ),
          },
        ],
      },
    ],
  },
];

const removeWelcomeNode = (
  items: TreeItem[],
  id: string,
  depth = 0,
): TreeItem[] =>
  items
    .map((item) => {
      if (item.id === id) {
        return depth === 0 ? item : null;
      }
      if (item.children) {
        return {
          ...item,
          children: removeWelcomeNode(item.children, id, depth + 1),
        };
      }
      return item;
    })
    .filter(Boolean) as TreeItem[];

const appendWelcomeChild = (
  items: TreeItem[],
  id: string,
  nextChild: TreeItem,
): TreeItem[] =>
  items.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        expanded: true,
        children: [...(item.children ?? []), nextChild],
      };
    }
    if (item.children) {
      return {
        ...item,
        children: appendWelcomeChild(item.children, id, nextChild),
      };
    }
    return item;
  });

export const Welcome = () => {
  const [projectStatus, setProjectStatus] = useState("draft");
  const [treeItems, setTreeItems] = useState<TreeItem[]>(createWelcomeTree);
  const [accentColor, setAccentColor] = useState<ColorValue>({
    r: 79 / 255,
    g: 128 / 255,
    b: 192 / 255,
  });
  const [position, setPosition] = useState<VectorValue>({ x: 0, y: 1, z: 2 });
  const nextTreeId = useRef(1);

  const takeTreeId = (prefix: string) => `${prefix}-${nextTreeId.current++}`;

  const boundTreeItems = useMemo(() => {
    const bindMenus = (nodes: TreeItem[], depth = 0): TreeItem[] =>
      nodes.map((node) => {
        const isFolder = node.children !== undefined;
        const canDelete = depth > 0;

        return {
          ...node,
          menuContent: (
            <Content style={{ minWidth: 200, textAlign: "left" }}>
              <ActionList role="presentation" divided={false}>
                {isFolder && (
                  <ActionListItem
                    role="menuitem"
                    leading={<Icon name="Folder" size="small" />}
                    title={<Paragraph>Add folder</Paragraph>}
                    onClick={() =>
                      setTreeItems((current) =>
                        appendWelcomeChild(current, node.id, {
                          id: takeTreeId("folder"),
                          label: <Paragraph>new-folder</Paragraph>,
                          expanded: true,
                          children: [],
                        }),
                      )
                    }
                  />
                )}
                {isFolder && (
                  <ActionListItem
                    role="menuitem"
                    leading={<Icon name="File" size="small" />}
                    title={<Paragraph>Add leaf</Paragraph>}
                    onClick={() =>
                      setTreeItems((current) =>
                        appendWelcomeChild(current, node.id, {
                          id: takeTreeId("leaf"),
                          label: <Paragraph>new-item</Paragraph>,
                        }),
                      )
                    }
                  />
                )}
                {canDelete && (
                  <ActionListItem
                    role="menuitem"
                    leading={<Icon name="Trash" size="small" />}
                    title={<Paragraph>Delete</Paragraph>}
                    onClick={() =>
                      setTreeItems((current) =>
                        removeWelcomeNode(current, node.id),
                      )
                    }
                  />
                )}
              </ActionList>
            </Content>
          ),
          children: node.children
            ? bindMenus(node.children, depth + 1)
            : undefined,
        };
      });

    return bindMenus(treeItems);
  }, [treeItems]);

  return (
    <div
      className="welcome__container"
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowY: "auto",
        color: "var(--oakd-font-color)",
        textAlign: "center",
        padding: "40px 0",
      }}
    >
      <Content pad>
        <Space gap>
          <Title>oakd</Title>
          <Paragraph>
            <em>v2.0.0</em>
            <br />
            by <strong>Gordon Goodrum</strong>
          </Paragraph>
        </Space>
        <Space
          direction="vertical"
          style={{ maxWidth: "720pt", width: "100%" }}
          gap
        >
          <Paragraph>
            <em>OakFrame Interactive Design & Component Library</em>
          </Paragraph>
          <Paragraph>
            Welcome to <strong>oakd</strong>, a modern and scalable TypeScript
            React component library designed for performance, flexibility, and
            accessibility. Explore our extensive suite of components and get
            started building better user interfaces today.
          </Paragraph>
          <Space direction="horizontal" gap>
            <Paragraph>
              <a href="https://github.com/arkamedus/oakd" target="_blank">
                GitHub Repo →
              </a>
            </Paragraph>
          </Space>

          <DebugLayer
            label={"oakd | oakframe.org"}
            style={{ backgroundColor: "var(--oakd-background)" }}
          >
            <Content pad>
              <Space gap direction={"vertical"} wide>
                <Space direction={"vertical"} gap wide>
                  <Paragraph>buttons</Paragraph>
                  <Space gap wide>
                    {["default", "primary", "warning", "danger"]
                      .slice(0, 16)
                      .map((type: ButtonType, idx) => {
                        return (
                          <Button
                            key={`button-${idx}`}
                            icon={"Star"}
                            size={"small"}
                            variant={type}
                          >
                            <Paragraph>{type}</Paragraph>
                          </Button>
                        );
                      })}
                    <ButtonGroup>
                      <Button
                        variant={"default"}
                        size={"small"}
                        icon={"Layers"}
                      />
                      <Button
                        variant={"ghost"}
                        size={"small"}
                        icon={"Triangle"}
                      >
                        <Paragraph>groups</Paragraph>
                      </Button>
                      <Button
                        variant={"warning"}
                        size={"small"}
                        icon={"Trash"}
                      />
                    </ButtonGroup>
                  </Space>
                </Space>

                <Space direction={"vertical"} gap wide>
                  <Paragraph>inputs</Paragraph>
                  <Space gap wide>
                    <Input
                      icon={"User"}
                      placeholder={"text"}
                      type={"text"}
                      variant={"default"}
                    />
                    <Input
                      icon={"Star"}
                      placeholder={"password"}
                      type={"password"}
                      variant={"default"}
                    />
                    <Input
                      icon={"List"}
                      type={"number"}
                      variant={"default"}
                      error
                      defaultValue={-1}
                    />
                  </Space>
                </Space>

                <Space direction={"vertical"} gap wide>
                  <Paragraph>extended inputs</Paragraph>
                  <Space wide gap justify={"between"}>
                    <Select
                      value={projectStatus}
                      options={[
                        {
                          value: "draft",
                          label: <Paragraph>Draft</Paragraph>,
                          element: (
                            <ActionListItem
                              leading={<Icon name="Note" size="small" />}
                              title={<Paragraph>Draft</Paragraph>}
                            />
                          ),
                        },
                        {
                          value: "in_review",
                          label: <Paragraph>In review</Paragraph>,
                          element: (
                            <ActionListItem
                              leading={<Icon name="Eye" size="small" />}
                              title={<Paragraph>In review</Paragraph>}
                            />
                          ),
                        },
                        {
                          value: "published",
                          label: <Paragraph>Published</Paragraph>,
                          element: (
                            <ActionListItem
                              leading={<Icon name="Check" size="small" />}
                              title={<Paragraph>Published</Paragraph>}
                            />
                          ),
                        },
                      ]}
                      onChange={setProjectStatus}
                      placeholder="Choose a status"
                    />
                    <Dropdown
                      label={
                        <Space gap>
                          <IconDots size="small" />
                          <Paragraph>Project actions</Paragraph>
                        </Space>
                      }
                      direction={"bottom-right"}
                      closeOnSelect
                    >
                      <Content style={{ minWidth: 240, textAlign: "left" }}>
                        <ActionList role="menu" divided={false}>
                          <ActionListItem
                            role="menuitem"
                            leading={<Icon name="Eye" size="small" />}
                            title={<Paragraph>Request review</Paragraph>}
                            onClick={() => undefined}
                          />
                          <ActionListItem
                            role="menuitem"
                            leading={<Icon name="Check" size="small" />}
                            title={<Paragraph>Publish project</Paragraph>}
                            onClick={() => undefined}
                          />
                        </ActionList>
                        <Divider />
                        <ActionList role="menu" divided={false}>
                          <ActionListItem
                            role="menuitem"
                            leading={<Icon name="Note" size="small" />}
                            title={<Paragraph>Return to draft</Paragraph>}
                            onClick={() => undefined}
                          />
                        </ActionList>
                      </Content>
                    </Dropdown>
                  </Space>
                  <CodeArea
                    grow
                    lineNumbers
                    errorLines={[3]}
                    highlightCurrentLine
                    style={{ textAlign: "left" }}
                    defaultValue={
                      "// javascript syntax highlighting\nconst name = `oakd`;\n// with configurable line support!"
                    }
                  />
                </Space>

                <Collapsible
                  title={
                    <Paragraph>
                      <strong>Collapsible</strong> Click to open
                    </Paragraph>
                  }
                >
                  <Divider />
                  <Content pad>
                    <Paragraph>This was hidden</Paragraph>
                  </Content>
                </Collapsible>

                <Space direction={"vertical"} gap>
                  <Paragraph>small utils</Paragraph>
                  <Breadcrumb
                    items={[
                      {
                        text: (
                          <Paragraph>
                            <IconHome size={"small"} /> Root
                          </Paragraph>
                        ),
                      },
                      { text: <Paragraph>Category</Paragraph> },
                      {
                        text: (
                          <Paragraph>
                            <strong>Section</strong>
                          </Paragraph>
                        ),
                      },
                    ]}
                  />
                  <Space direction={"vertical"} gap wide>
                    <Pagination
                      maxPage={21}
                      currentPage={5}
                      showPreviousNext
                      showNumbers
                      showEllipsis
                      size={"small"}
                    />
                  </Space>
                  <Announcement variant={"primary"} closable>
                    <Paragraph>
                      This is a dismissible primary Announcement!
                    </Paragraph>
                  </Announcement>
                  <Row
                    gap
                    wide
                    //justify={"stretch"}
                    //align={"stretch"}
                  >
                    <Col xs={24} md={12}>
                      <Card pad>
                        <Space align={"center"} justify={"center"} gap>
                          <Icon name="Layers" size="large" />
                          <Paragraph>
                            this is a card!
                            <br />
                            it has multiple lines or text centered
                          </Paragraph>
                        </Space>
                      </Card>
                    </Col>
                    <Col xs={12} md={6}>
                      <Card pad fill variant={"ghost"}>
                        <Space align={"end"} justify={"center"} fill>
                          <Title>42</Title>
                          <Paragraph>tk/s</Paragraph>
                        </Space>
                      </Card>
                    </Col>
                    <Col xs={12} md={6}>
                      <Card pad fill>
                        <Space align={"center"} justify={"center"} fill>
                          <Card pad variant={"ghost"}>
                            <Paragraph>centered card</Paragraph>
                          </Card>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                  <Paragraph>svg icons</Paragraph>
                  <Space wide gap justify={"between"}>
                    {IconTypes.slice(0, 152).map(
                      (icon: CoreIconNameType, idx: number) => {
                        return (
                          <Paragraph>
                            <Icon
                              key={`icon-${idx}`}
                              name={icon}
                              size="small"
                            />
                          </Paragraph>
                        );
                      },
                    )}
                    <Paragraph>
                      <em>and more!</em>
                    </Paragraph>
                  </Space>
                </Space>

                <Space direction={"vertical"} gap wide>
                  <Paragraph>data displays</Paragraph>
                  <Row gap>
                    <Column xs={24} md={12}>
                      <Card pad wide fill>
                        <Space
                          direction={"vertical"}
                          gap
                          wide
                          fill
                          align={"stretch"}
                        >
                          <Paragraph>
                            <strong>multi line graphs</strong>
                          </Paragraph>
                          <Content grow fill wide>
                            <MultiLineChart
                              lines={[
                                {
                                  label: "Signups",
                                  values: [
                                    { x: "2026-04-01", y: 18 },
                                    { x: "2026-04-02", y: 24 },
                                    { x: "2026-04-03", y: 28 },
                                    { x: "2026-04-04", y: 31 },
                                    { x: "2026-04-05", y: 35 },
                                  ],
                                },
                                {
                                  label: "Activations",
                                  values: [
                                    { x: "2026-04-01", y: 12 },
                                    { x: "2026-04-02", y: 16 },
                                    { x: "2026-04-03", y: 22 },
                                    { x: "2026-04-04", y: 20 },
                                    { x: "2026-04-05", y: 26 },
                                  ],
                                },
                                {
                                  label: "Retention",
                                  values: [
                                    { x: "2026-04-01", y: 8 },
                                    { x: "2026-04-02", y: 11 },
                                    { x: "2026-04-03", y: 13 },
                                    { x: "2026-04-04", y: 14 },
                                    { x: "2026-04-05", y: 18 },
                                  ],
                                },
                              ]}
                              hoverLabel={"events"}
                              fill
                              showVerticalTicks
                              smooth
                            />
                          </Content>
                        </Space>
                      </Card>
                    </Column>

                    <Column xs={24} md={12}>
                      <Card pad wide fill>
                        <Space
                          direction={"vertical"}
                          gap
                          wide
                          fill
                          align={"stretch"}
                        >
                          <Paragraph>
                            <strong>stacked bar graphs</strong>
                          </Paragraph>
                          <Content grow fill wide>
                            <StackedBreakdownChart
                              labels={[
                                "Helpful",
                                "Neutral",
                                "Risky",
                                "Escalated",
                              ]}
                              xLabels={[
                                <Paragraph key={"wk1"}>Week 1</Paragraph>,
                                <Paragraph key={"wk2"}>Week 2</Paragraph>,
                                <Paragraph key={"wk3"}>Week 3</Paragraph>,
                                <Paragraph key={"wk4"}>Week 4</Paragraph>,
                                <Paragraph key={"wk5"}>Week 5</Paragraph>,
                              ]}
                              rows={[
                                {
                                  key: "week-1",
                                  labelWeights: {
                                    Helpful: 0.48,
                                    Neutral: 0.27,
                                    Risky: 0.17,
                                    Escalated: 0.08,
                                  },
                                },
                                {
                                  key: "week-2",
                                  labelWeights: {
                                    Helpful: 0.55,
                                    Neutral: 0.2,
                                    Risky: 0.16,
                                    Escalated: 0.09,
                                  },
                                },
                                {
                                  key: "week-3",
                                  labelWeights: {
                                    Helpful: 0.58,
                                    Neutral: 0.18,
                                    Risky: 0.14,
                                    Escalated: 0.1,
                                  },
                                },
                                {
                                  key: "week-4",
                                  labelWeights: {
                                    Helpful: 0.51,
                                    Neutral: 0.24,
                                    Risky: 0.15,
                                    Escalated: 0.1,
                                  },
                                },
                                {
                                  key: "week-5",
                                  labelWeights: {
                                    Helpful: 0.63,
                                    Neutral: 0.16,
                                    Risky: 0.11,
                                    Escalated: 0.1,
                                  },
                                },
                              ]}
                            />
                          </Content>
                        </Space>
                      </Card>
                    </Column>

                    <Col xs={24} md={12}>
                      <Card pad wide fill>
                        <Space
                          direction={"vertical"}
                          gap
                          wide
                          align={"stretch"}
                        >
                          <Paragraph>
                            <strong>tree with drag and drop</strong>
                          </Paragraph>
                          <Tree
                            items={boundTreeItems}
                            onChange={setTreeItems}
                            wide
                          />
                        </Space>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card pad wide fill>
                        <Space direction="vertical" gap wide align="stretch">
                          <Paragraph>
                            <strong>thumbnail select</strong>
                          </Paragraph>
                          <ThumbnailSelect
                            defaultValue="cube"
                            wide
                            options={[
                              {
                                value: "cube",
                                title: <Paragraph>Cube</Paragraph>,
                                note: <Paragraph>Scene primitive</Paragraph>,
                                preview: <Icon name="Cube" />,
                              },
                              {
                                value: "sphere",
                                title: <Paragraph>Sphere</Paragraph>,
                                note: <Paragraph>Scene primitive</Paragraph>,
                                preview: <Icon name="Sphere" />,
                              },
                            ]}
                          />
                          <Paragraph>
                            <strong>color select</strong>
                          </Paragraph>
                          <ColorField
                            value={accentColor}
                            onChange={setAccentColor}
                            wide
                          />
                          <Paragraph>
                            <strong>vector editor</strong>
                          </Paragraph>
                          <VectorField
                            value={position}
                            onChange={setPosition}
                            dimensions={3}
                            layout="toolbar"
                            wide
                          />
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </Space>
                <Paragraph>row w/ gap & columns</Paragraph>
                <Row gap>
                  <Column xs={24}>
                    <DebugLayer label={"Col 24"} />
                  </Column>
                  <Column xs={12}>
                    <DebugLayer label={"Col 12"} />
                  </Column>
                  <Column xs={6}>
                    <DebugLayer label={"Col 6"} />
                  </Column>

                  <Column xs={4}>
                    <DebugLayer />
                  </Column>
                  <Column xs={2}>
                    <DebugLayer />
                  </Column>

                  {[
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1,
                  ].map((col, idx) => {
                    return (
                      <Column xs={1} key={`col-${idx}`}>
                        <DebugLayer />
                      </Column>
                    );
                  })}
                </Row>
              </Space>
            </Content>
          </DebugLayer>
        </Space>
      </Content>
    </div>
  );
};
