import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import ActionList, { ActionListItem } from "../ActionList/ActionList";
import Card from "../Card/Card";
import Paragraph from "../Paragraph/Paragraph";
import Pill from "../Pill/Pill";
import { IconPlus, IconTrash } from "../../Icon/Icons.bin";
import Tree from "./Tree";
import { TreeItem } from "./Tree.types";

const meta: Meta<typeof Tree> = {
  title: "Design System/Atomic/Tree",
  component: Tree,
};

export default meta;

type Story = StoryObj<typeof Tree>;

const documentationItems = (): TreeItem[] => [
  {
    id: "root",
    label: "OakD documentation",
    icon: "Book",
    expanded: true,
    children: [
      {
        id: "getting-started",
        label: "Getting started",
        icon: "Flag",
        expanded: true,
        children: [
          { id: "introduction", label: "Introduction", icon: "Note" },
          { id: "installation", label: "Installation", icon: "Download" },
        ],
      },
      {
        id: "components",
        label: "Components",
        icon: "Apps",
        expanded: false,
        children: [
          { id: "inputs", label: "Inputs", icon: "PointerText" },
          { id: "layouts", label: "Layouts", icon: "Layout" },
        ],
      },
      {
        id: "release-notes",
        label: "Release notes",
        icon: "PenPaper",
      },
    ],
  },
];

const releaseItems = (): TreeItem[] => [
  {
    id: "root",
    label: "OakD release",
    icon: "Flag",
    expanded: true,
    children: [
      {
        id: "interface",
        label: "Interface inventory",
        icon: "Clipboard",
        leaf: (
          <Pill variant="success" size="sm">
            <Paragraph>Complete</Paragraph>
          </Pill>
        ),
      },
      {
        id: "keyboard",
        label: "Keyboard audit",
        icon: "Check",
        leaf: (
          <Pill variant="warning" size="sm">
            <Paragraph>Review</Paragraph>
          </Pill>
        ),
      },
      {
        id: "migration",
        label: "Migration guide",
        icon: "Book",
        leaf: (
          <Pill variant="primary" size="sm">
            <Paragraph>Writing</Paragraph>
          </Pill>
        ),
      },
      {
        id: "publish",
        label: "Publish checklist",
        icon: "Lock",
        leaf: (
          <Pill variant="danger" size="sm">
            <Paragraph>Blocked</Paragraph>
          </Pill>
        ),
      },
    ],
  },
];

const assetItems = (): TreeItem[] => [
  {
    id: "root",
    label: "Asset library",
    icon: "Layers",
    expanded: true,
    children: [
      {
        id: "models",
        label: "Models",
        icon: "Shapes",
        expanded: true,
        children: [
          { id: "cube", label: "Cube", icon: "Cube" },
          { id: "sphere", label: "Sphere", icon: "Sphere" },
        ],
      },
      {
        id: "materials",
        label: "Materials",
        icon: "PaintPalette",
        expanded: true,
        children: [
          { id: "metal", label: "Brushed metal", icon: "PaintBucket" },
          { id: "wood", label: "Dark wood", icon: "PaintBucket" },
        ],
      },
    ],
  },
];

const workflowItems = (): TreeItem[] => [
  {
    id: "root",
    label: "Launch workflow",
    icon: "Step",
    expanded: true,
    children: [
      {
        id: "brief",
        label: "Brief",
        icon: "Note",
        leaf: (
          <Pill size="sm">
            <Paragraph>01</Paragraph>
          </Pill>
        ),
      },
      {
        id: "prototype",
        label: "Prototype",
        icon: "Shapes",
        leaf: (
          <Pill size="sm">
            <Paragraph>02</Paragraph>
          </Pill>
        ),
      },
      {
        id: "review",
        label: "Review",
        icon: "Eye",
        leaf: (
          <Pill size="sm">
            <Paragraph>03</Paragraph>
          </Pill>
        ),
      },
      {
        id: "publish",
        label: "Publish",
        icon: "OpenExternal",
        leaf: (
          <Pill size="sm">
            <Paragraph>04</Paragraph>
          </Pill>
        ),
      },
    ],
  },
];

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(documentationItems());
    return <Tree items={items} onChange={setItems} wide />;
  },
};

export const WithCustomLeafElements: Story = {
  render: () => {
    const [items, setItems] = useState(releaseItems());
    return <Tree items={items} onChange={setItems} wide />;
  },
};

export const WithAddDeleteAndContextMenu: Story = {
  render: () => {
    const [items, setItems] = useState(assetItems());

    const bindMenus = (nodes: TreeItem[], depth = 0): TreeItem[] =>
      nodes.map((node) => ({
        ...node,
        menuContent: (
          <Card wide>
            <ActionList role="presentation" divided={false}>
              <ActionListItem
                role="menuitem"
                leading={<IconPlus size="small" />}
                title={<Paragraph>Add child</Paragraph>}
                onClick={() =>
                  setItems((current) =>
                    appendChild(current, node.id, {
                      id: `${node.id}-new-${Date.now()}`,
                      label: "New asset",
                      icon: "Cube",
                    }),
                  )
                }
              />
              {depth > 0 ? (
                <ActionListItem
                  role="menuitem"
                  leading={<IconTrash size="small" />}
                  title={<Paragraph>Delete</Paragraph>}
                  onClick={() =>
                    setItems((current) => removeNode(current, node.id))
                  }
                />
              ) : null}
            </ActionList>
          </Card>
        ),
        children: node.children
          ? bindMenus(node.children, depth + 1)
          : undefined,
      }));

    return <Tree items={bindMenus(items)} onChange={setItems} wide guides />;
  },
};

export const WithDragAndDropReorder: Story = {
  render: () => {
    const [items, setItems] = useState(workflowItems());
    return <Tree items={items} onChange={setItems} wide />;
  },
};

export const WithEmptyFolder: Story = {
  render: () => {
    const [items, setItems] = useState<TreeItem[]>([
      {
        id: "root",
        label: "New workspace",
        icon: "Apps",
        expanded: true,
        children: [
          {
            id: "uploads",
            label: "Uploads",
            icon: "Folder",
            expanded: true,
            children: [],
          },
        ],
      },
    ]);
    return <Tree items={items} onChange={setItems} wide pad />;
  },
};

const removeNode = (items: TreeItem[], id: string): TreeItem[] =>
  items
    .map((item) => {
      if (item.id === id) return null;
      if (item.children) {
        return { ...item, children: removeNode(item.children, id) };
      }
      return item;
    })
    .filter(Boolean) as TreeItem[];

const appendChild = (
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
      return { ...item, children: appendChild(item.children, id, nextChild) };
    }
    return item;
  });
