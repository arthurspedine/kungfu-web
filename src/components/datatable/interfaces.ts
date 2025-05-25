import type { Column, Table } from '@tanstack/react-table'

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterColumns: {
    id: string
    label: string
    mapFunction?: (value: string) => { label: string }
  }[]
  loading?: boolean
}

export interface ButtonConfigProps {
  buttonConfig: {
    label: string
    redirectTo?: string
  }
}

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  mapFunction?: (value: string) => { label: string }
  disabled?: boolean
}

export interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface DataTableState {
  page: number
  size: number
  filters: Record<string, string[]>
}

export interface DataTablePaginationProps {
  currentPage: number
  pageSize: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  loading?: boolean
}
