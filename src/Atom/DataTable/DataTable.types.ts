import React from "react";
import { CoreIconNameType } from "../../Icon/Icons.bin";

export type DataTableColumnSpan =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;
export type DataTableAlignment = "start" | "center" | "end";
export type DataTableSortDirection = "asc" | "desc";

export interface DataTableSort {
  columnId: string;
  direction: DataTableSortDirection;
}

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  render: (row: T, index: number) => React.ReactNode;
  getSortValue?: (
    row: T,
  ) => string | number | boolean | Date | null | undefined;
  sortable?: boolean;
  hidden?: boolean;
  xs: DataTableColumnSpan;
  sm?: DataTableColumnSpan;
  md?: DataTableColumnSpan;
  lg?: DataTableColumnSpan;
  xl?: DataTableColumnSpan;
  align?: DataTableAlignment;
}

export interface DataTableProps<T> {
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  getRowId: (row: T) => React.Key;
  title?: string;
  icon?: CoreIconNameType;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  sort?: DataTableSort;
  defaultSort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: readonly number[];
  onPageSizeChange?: (pageSize: number) => void;
  totalRows?: number;
  onRowActivate?: (row: T) => void;
  rowAriaLabel?: (row: T) => string;
  loading?: boolean;
  empty?: React.ReactNode;
  emptyTitle?: string;
  emptyBody?: string;
  loadingContent?: React.ReactNode;
  className?: string;
}
