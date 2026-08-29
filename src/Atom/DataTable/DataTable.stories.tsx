import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Button from "../Button/Button";
import Paragraph from "../Paragraph/Paragraph";
import Pill from "../Pill/Pill";
import DataTable from "./DataTable";
import { DataTableColumn, DataTableSort } from "./DataTable.types";

type ReleaseStatus = "Ready" | "Needs review" | "Blocked" | "Complete";
type ReleaseRow = {
  id: number;
  release: string;
  owner: string;
  status: ReleaseStatus;
  checks: number;
};

const rows: ReleaseRow[] = [
  {
    id: 1,
    release: "Desktop 4.2.0",
    owner: "Maya Chen",
    status: "Ready",
    checks: 18,
  },
  {
    id: 2,
    release: "API schema migration",
    owner: "Sergio Diaz",
    status: "Needs review",
    checks: 16,
  },
  {
    id: 3,
    release: "Billing webhook retry",
    owner: "River Patel",
    status: "Blocked",
    checks: 11,
  },
  {
    id: 4,
    release: "Search relevance tuning",
    owner: "Avery Brooks",
    status: "Complete",
    checks: 18,
  },
  {
    id: 5,
    release: "Mobile sign-in refresh",
    owner: "Maya Chen",
    status: "Ready",
    checks: 18,
  },
  {
    id: 6,
    release: "Audit log export",
    owner: "Sergio Diaz",
    status: "Needs review",
    checks: 17,
  },
  {
    id: 7,
    release: "Workspace invitations",
    owner: "River Patel",
    status: "Complete",
    checks: 18,
  },
  {
    id: 8,
    release: "Usage report delivery",
    owner: "Avery Brooks",
    status: "Ready",
    checks: 18,
  },
  {
    id: 9,
    release: "SAML certificate rotation",
    owner: "Maya Chen",
    status: "Blocked",
    checks: 9,
  },
  {
    id: 10,
    release: "Notification preferences",
    owner: "Sergio Diaz",
    status: "Complete",
    checks: 18,
  },
  {
    id: 11,
    release: "Account recovery flow",
    owner: "River Patel",
    status: "Needs review",
    checks: 15,
  },
  {
    id: 12,
    release: "Invoice detail view",
    owner: "Avery Brooks",
    status: "Ready",
    checks: 18,
  },
];

const columns: DataTableColumn<ReleaseRow>[] = [
  {
    id: "release",
    header: (
      <Paragraph>
        <strong>Release</strong>
      </Paragraph>
    ),
    render: (row) => <Paragraph>{row.release}</Paragraph>,
    xs: 24,
    md: 8,
  },
  {
    id: "owner",
    header: (
      <Paragraph>
        <strong>Owner</strong>
      </Paragraph>
    ),
    render: (row) => <Paragraph>{row.owner}</Paragraph>,
    xs: 12,
    md: 5,
  },
  {
    id: "status",
    header: (
      <Paragraph>
        <strong>Status</strong>
      </Paragraph>
    ),
    render: (row) => (
      <Pill
        size="sm"
        variant={
          row.status === "Blocked"
            ? "danger"
            : row.status === "Needs review"
              ? "warning"
              : row.status === "Complete"
                ? "success"
                : "default"
        }
      >
        {row.status}
      </Pill>
    ),
    xs: 12,
    md: 5,
  },
  {
    id: "checks",
    header: (
      <Paragraph>
        <strong>Checks</strong>
      </Paragraph>
    ),
    render: (row) => <Paragraph>{row.checks} / 18</Paragraph>,
    xs: 6,
    md: 4,
    align: "end",
  },
  {
    id: "actions",
    header: (
      <Paragraph>
        <strong>Actions</strong>
      </Paragraph>
    ),
    render: () => (
      <Button variant="ghost" icon="Dots" aria-label="Record actions" />
    ),
    xs: 6,
    md: 2,
    align: "end",
  },
];

const sortableColumns: DataTableColumn<ReleaseRow>[] = columns.map((column) => {
  if (column.id === "release") {
    return {
      ...column,
      sortable: true,
      getSortValue: (row) => row.release,
    };
  }
  if (column.id === "checks") {
    return {
      ...column,
      sortable: true,
      getSortValue: (row) => row.checks,
    };
  }
  return column;
});

const meta: Meta<typeof DataTable<ReleaseRow>> = {
  title: "Design System/Atomic/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable<ReleaseRow>>;

export const Default: Story = {
  render: (args) => <DataTable {...args} />,
  args: {
    columns,
    rows,
    getRowId: (row) => row.id,
    defaultPageSize: rows.length,
    pageSizeOptions: [rows.length],
    onRowActivate: () => undefined,
    rowAriaLabel: (row) => `Open ${row.release}`,
  },
};

export const ServerPagination: Story = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState(2);
      const [pageSize, setPageSize] = useState(5);
      const [sort, setSort] = useState<DataTableSort>({
        columnId: "checks",
        direction: "desc",
      });
      return (
        <DataTable
          columns={sortableColumns}
          rows={rows.slice(0, pageSize)}
          getRowId={(row) => row.id}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 25]}
          totalRows={42}
          sort={sort}
          onSortChange={setSort}
        />
      );
    };
    return <Demo />;
  },
};

export const Loading: Story = {
  args: {
    columns,
    rows: [],
    getRowId: (row) => row.id,
    pageSizeOptions: [10],
    loading: true,
    loadingContent: <Paragraph>Loading releases…</Paragraph>,
  },
};

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    getRowId: (row) => row.id,
    pageSizeOptions: [10],
    emptyTitle: "No matching releases",
    emptyBody: "Change the active filters and try again.",
  },
};
