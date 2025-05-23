import type { ButtonConfigProps } from '@/components/datatable/interfaces'
import type { ColumnDef } from '@tanstack/react-table'

export type Page<T> = {
  data: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface DataTableServerProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: Page<TData>
  filterColumns: {
    id: string
    label: string
    mapFunction?: (value: string) => string
  }[]
  buttonConfig?: ButtonConfigProps
  onStateChange: (state: DataTableState) => void
  loading?: boolean
}

export interface DataTableState {
  page: number
  size: number
  filters: Record<string, string[]>
  sorting: {
    field: string
    direction: 'asc' | 'desc'
  }
}
