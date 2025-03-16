import type { Table } from '@tanstack/react-table'

export interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export interface ButtonConfigProps {
  buttonConfig: {
    label: string
    redirectTo?: string
  }
}
