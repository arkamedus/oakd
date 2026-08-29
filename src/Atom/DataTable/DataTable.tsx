import React, { useEffect, useMemo, useState } from "react";
import Col from "../../Layout/Column/Column";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import Row from "../../Layout/Row/Row";
import Content from "../../Layout/Content/Content";
import ActionList from "../ActionList/ActionList";
import Card from "../Card/Card";
import Icon from "../../Icon/Icon";
import Pagination from "../Pagination/Pagination";
import Paragraph from "../Paragraph/Paragraph";
import Select from "../Select/Select";
import Space from "../Space/Space";
import {
  DataTableColumnSpan,
  DataTableProps,
  DataTableSort,
} from "./DataTable.types";

const normalizeSortValue = (
  value: string | number | boolean | Date | null | undefined,
) => (value instanceof Date ? value.getTime() : value);

const compareSortValues = (
  left: string | number | boolean | Date | null | undefined,
  right: string | number | boolean | Date | null | undefined,
) => {
  const a = normalizeSortValue(left);
  const b = normalizeSortValue(right);
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const TableCol = ({
  xs,
  sm,
  md,
  lg,
  xl,
  children,
}: {
  xs: DataTableColumnSpan;
  sm?: DataTableColumnSpan;
  md?: DataTableColumnSpan;
  lg?: DataTableColumnSpan;
  xl?: DataTableColumnSpan;
  children: React.ReactNode;
}) => {
  const resolvedSm = sm ?? xs;
  const resolvedMd = md ?? resolvedSm;
  const resolvedLg = lg ?? resolvedMd;
  const resolvedXl = xl ?? resolvedLg;
  return (
    <Col
      xs={xs}
      sm={resolvedSm}
      md={resolvedMd}
      lg={resolvedLg}
      xl={resolvedXl}
      xls={resolvedXl}
    >
      {children}
    </Col>
  );
};

export default function DataTable<T>({
  columns,
  rows,
  getRowId,
  title,
  icon = "Table",
  actions,
  filters,
  sort,
  defaultSort,
  onSortChange,
  page,
  defaultPage = 1,
  onPageChange,
  pageSize,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  onPageSizeChange,
  totalRows,
  onRowActivate,
  rowAriaLabel,
  loading = false,
  empty,
  emptyTitle = "No results",
  emptyBody = "Try adjusting the current filters.",
  loadingContent = <Paragraph>Loading…</Paragraph>,
  className,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((column) => !column.hidden);
  const sortableColumns = columns.filter(
    (column) => column.sortable && column.getSortValue,
  );
  const [internalSort, setInternalSort] = useState<DataTableSort | undefined>(
    defaultSort,
  );
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
  const activeSort = sort ?? internalSort;
  const activePageSize = pageSize ?? internalPageSize;
  const serverMode = totalRows !== undefined;

  const sortedRows = useMemo(() => {
    if (serverMode || !activeSort) return [...rows];
    const column = columns.find(
      (candidate) => candidate.id === activeSort.columnId,
    );
    if (!column?.getSortValue) return [...rows];
    return rows
      .map((row, originalIndex) => ({ row, originalIndex }))
      .sort((left, right) => {
        const compared = compareSortValues(
          column.getSortValue?.(left.row),
          column.getSortValue?.(right.row),
        );
        if (compared === 0) return left.originalIndex - right.originalIndex;
        return activeSort.direction === "asc" ? compared : -compared;
      })
      .map(({ row }) => row);
  }, [activeSort, columns, rows, serverMode]);

  const rowCount = totalRows ?? sortedRows.length;
  const maxPage = Math.max(1, Math.ceil(rowCount / activePageSize));
  const requestedPage = page ?? internalPage;
  const activePage = Math.min(requestedPage, maxPage);
  const displayedRows = serverMode
    ? sortedRows
    : sortedRows.slice(
        (activePage - 1) * activePageSize,
        activePage * activePageSize,
      );
  const start = rowCount ? (activePage - 1) * activePageSize + 1 : 0;
  const end = rowCount
    ? Math.min(start + displayedRows.length - 1, rowCount)
    : 0;

  const updatePage = (nextPage: number) => {
    if (page === undefined) setInternalPage(nextPage);
    onPageChange?.(nextPage);
  };
  const updatePageSize = (nextPageSize: number) => {
    if (pageSize === undefined) setInternalPageSize(nextPageSize);
    onPageSizeChange?.(nextPageSize);
    updatePage(1);
  };
  const updateSort = (nextSort: DataTableSort) => {
    if (sort === undefined) setInternalSort(nextSort);
    onSortChange?.(nextSort);
    updatePage(1);
  };

  useEffect(() => {
    if (requestedPage <= maxPage) return;
    if (page === undefined) setInternalPage(maxPage);
    onPageChange?.(maxPage);
  }, [maxPage, onPageChange, page, requestedPage]);

  return (
    <Space className={className} direction="vertical" gap wide>
      {title || actions ? (
        <Row gap wide>
          <Col xs={24} md={12}>
            {title ? (
              <Space gap align="center">
                <Icon name={icon} />
                <Paragraph>
                  <strong>{title}</strong>
                </Paragraph>
              </Space>
            ) : null}
          </Col>
          <Col xs={24} md={12}>
            <Space gap justify="end" align="center" wide>
              {actions}
            </Space>
          </Col>
        </Row>
      ) : null}

      {filters ? (
        <HorizontalScroll>
          <Space gap align="center">
            {filters}
          </Space>
        </HorizontalScroll>
      ) : null}

      {sortableColumns.length || pageSizeOptions.length > 1 ? (
        <Row gap wide>
          <Col xs={24} md={12}>
            {sortableColumns.length ? (
              <Space gap align="center">
                <Select
                  value={activeSort?.columnId ?? ""}
                  placeholder={<Paragraph>Sort by</Paragraph>}
                  options={sortableColumns.map((column) => ({
                    value: column.id,
                    element: column.header,
                  }))}
                  onChange={(columnId) =>
                    updateSort({
                      columnId,
                      direction:
                        activeSort?.columnId === columnId
                          ? activeSort.direction
                          : "asc",
                    })
                  }
                />
                <Select
                  value={activeSort?.direction ?? "asc"}
                  disabled={!activeSort}
                  options={[
                    {
                      value: "asc" as const,
                      element: <Paragraph>Ascending</Paragraph>,
                    },
                    {
                      value: "desc" as const,
                      element: <Paragraph>Descending</Paragraph>,
                    },
                  ]}
                  onChange={(direction) => {
                    if (activeSort) updateSort({ ...activeSort, direction });
                  }}
                />
              </Space>
            ) : null}
          </Col>
          <Col xs={24} md={12}>
            <Space gap justify="end" align="center" wide>
              <Paragraph>Rows per page</Paragraph>
              <Select
                value={activePageSize}
                options={pageSizeOptions.map((value) => ({
                  value,
                  element: <Paragraph>{value.toLocaleString()}</Paragraph>,
                }))}
                onChange={updatePageSize}
              />
            </Space>
          </Col>
        </Row>
      ) : null}

      {loading ? (
        <Card pad wide variant="ghost" role="status">
          {loadingContent}
        </Card>
      ) : displayedRows.length ? (
        <Space direction="vertical" gap wide>
          <Card pad wide variant="ghost">
            <Row gap wide>
              {visibleColumns.map((column) => (
                <TableCol key={column.id} {...column}>
                  <Space
                    align="center"
                    justify={column.align ?? "start"}
                    wide
                    fill
                  >
                    {column.header}
                  </Space>
                </TableCol>
              ))}
            </Row>
          </Card>
          <ActionList>
            {displayedRows.map((row, pageIndex) => {
              const absoluteIndex =
                (activePage - 1) * activePageSize + pageIndex;
              return (
                <Content
                  key={getRowId(row)}
                  className={[
                    "oakd-action-list__item",
                    onRowActivate && "oakd-action-list__item--interactive",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  role={onRowActivate ? "button" : "listitem"}
                  tabIndex={onRowActivate ? 0 : undefined}
                  aria-label={onRowActivate ? rowAriaLabel?.(row) : undefined}
                  onClick={onRowActivate ? () => onRowActivate(row) : undefined}
                  onKeyDown={
                    onRowActivate
                      ? (event) => {
                          if (event.key !== "Enter" && event.key !== " ")
                            return;
                          event.preventDefault();
                          onRowActivate(row);
                        }
                      : undefined
                  }
                >
                  <Row gap wide>
                    {visibleColumns.map((column) => (
                      <TableCol key={column.id} {...column}>
                        <Space
                          align="center"
                          justify={column.align ?? "start"}
                          wide
                          fill
                        >
                          {column.render(row, absoluteIndex)}
                        </Space>
                      </TableCol>
                    ))}
                  </Row>
                </Content>
              );
            })}
          </ActionList>
        </Space>
      ) : (
        <Card pad wide variant="ghost">
          {empty ?? (
            <Space direction="vertical" gap wide>
              <Paragraph>
                <strong>{emptyTitle}</strong>
              </Paragraph>
              {emptyBody ? <Paragraph>{emptyBody}</Paragraph> : null}
            </Space>
          )}
        </Card>
      )}

      <Row gap wide>
        <Col xs={24} md={12}>
          <Space align="center" wide fill>
            <Paragraph>
              {start.toLocaleString()}-{end.toLocaleString()} of{" "}
              {rowCount.toLocaleString()}
            </Paragraph>
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Space justify="end" align="center" wide>
            <Pagination
              maxPage={maxPage}
              currentPage={activePage}
              onPageChange={updatePage}
              count={5}
              showPreviousNext
              showNumbers
              showEllipsis
            />
          </Space>
        </Col>
      </Row>
    </Space>
  );
}
