'use client'
import {} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import type { ButtonConfigProps, DataTableState, Page } from './interfaces'

interface CustomColumnMeta {
  hidden?: boolean
}

type CustomColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: CustomColumnMeta
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: Page<TData>
  filterColumns: {
    id: string
    label: string
    mapFunction?: (value: string) => { label: string }
  }[]
  onStateChange: (state: Partial<DataTableState>) => void
  loading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  buttonConfig,
  filterColumns,
  onStateChange,
  loading = false,
}: DataTableProps<TData, TValue> & ButtonConfigProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: data.content,
    columns,
    state: {
      pagination: {
        pageIndex: data.page,
        pageSize: data.size,
      },
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: data.totalPages,
  })

  const headerGroups = table.getHeaderGroups()

  return (
    <div>
      <DataTableToolbar
        table={table}
        buttonConfig={buttonConfig}
        filterColumns={filterColumns}
        loading={loading}
      />
      <div className='border border-input rounded-xl w-full overflow-auto'>
        <Table className='bg-[#F5F5F5]'>
          <TableHeader>
            {headerGroups.map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers
                  .filter(header => {
                    const column = header.column.columnDef as CustomColumnDef<
                      TData,
                      unknown
                    >
                    return !column.meta?.hidden
                  })
                  .map(header => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className='text-nowrap'
                      >
                        {header.isPlaceholder ? null : (
                          // biome-ignore lint/a11y/useKeyWithClickEvents: accept all key events
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none flex items-center gap-2'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className='text-xs'>
                                {{
                                  asc: <ArrowUp className='size-4' />,
                                  desc: <ArrowDown className='size-4' />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <ChevronsUpDown className='size-4' />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='bg-background'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row
                    .getVisibleCells()
                    .filter(cell => {
                      const column = cell.column.columnDef as CustomColumnDef<
                        TData,
                        unknown
                      >
                      return !column.meta?.hidden
                    })
                    .map(cell => (
                      <TableCell key={cell.id} className='text-nowrap'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        currentPage={data.page}
        pageSize={data.size}
        totalPages={data.totalPages}
        onPageChange={page => onStateChange({ page })}
        onPageSizeChange={size => onStateChange({ size })}
        loading={loading}
      />
    </div>
  )
}
