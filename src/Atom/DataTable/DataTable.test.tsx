import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Paragraph from "../Paragraph/Paragraph";
import DataTable from "./DataTable";

const columns = [
  {
    id: "name",
    header: <Paragraph>Name</Paragraph>,
    render: (row: { id: number; name: string }) => (
      <Paragraph>{row.name}</Paragraph>
    ),
    sortable: true,
    getSortValue: (row: { id: number; name: string }) => row.name,
    xs: 24 as const,
  },
];

it("uses a header card with divided ActionList entries", () => {
  render(
    <DataTable
      title="Records"
      columns={columns}
      rows={[{ id: 1, name: "Alpha" }]}
      getRowId={(row) => row.id}
      pageSizeOptions={[10]}
    />,
  );
  const header = screen
    .getAllByText("Name")
    .find((element) => element.closest(".card"))
    ?.closest(".card");
  const entry = screen.getByText("Alpha").closest(".oakd-action-list__item");
  expect(header).toBeInTheDocument();
  expect(entry).toHaveAttribute("role", "listitem");
  expect(entry).not.toHaveClass("card");
  expect(entry?.parentElement).toHaveClass(
    "oakd-action-list",
    "oakd-action-list--divided",
  );
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

it("activates interactive list rows from the keyboard", () => {
  const activate = jest.fn();
  render(
    <DataTable
      columns={columns}
      rows={[{ id: 1, name: "Alpha" }]}
      getRowId={(row) => row.id}
      pageSizeOptions={[10]}
      onRowActivate={activate}
      rowAriaLabel={(row) => `Open ${row.name}`}
    />,
  );

  const row = screen.getByRole("button", { name: "Open Alpha" });
  expect(row).toHaveClass("oakd-action-list__item--interactive");
  fireEvent.keyDown(row, { key: "Enter" });
  expect(activate).toHaveBeenCalledWith({ id: 1, name: "Alpha" });
});

it("sorts and paginates client rows from OakD controls", () => {
  render(
    <DataTable
      columns={columns}
      rows={[
        { id: 1, name: "B" },
        { id: 2, name: "A" },
      ]}
      getRowId={(row) => row.id}
      defaultPageSize={1}
      pageSizeOptions={[1, 2]}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Sort by" }));
  fireEvent.click(screen.getByRole("option", { name: "Name" }));
  expect(screen.getByText("A")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "2" }));
  expect(screen.getByText("B")).toBeInTheDocument();
});

it("renders loading and empty cards", () => {
  const { rerender } = render(
    <DataTable
      columns={columns}
      rows={[]}
      getRowId={(row) => row.id}
      pageSizeOptions={[10]}
      loading
    />,
  );
  expect(screen.getByRole("status")).toBeInTheDocument();
  rerender(
    <DataTable
      columns={columns}
      rows={[]}
      getRowId={(row) => row.id}
      pageSizeOptions={[10]}
    />,
  );
  expect(screen.getByText("No results")).toBeInTheDocument();
});
