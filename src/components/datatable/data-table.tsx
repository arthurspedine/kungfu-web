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
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import type { ButtonConfigProps } from './interfaces'

interface CustomColumnMeta {
  hidden?: boolean
}

type CustomColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: CustomColumnMeta
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumns: {
    id: string
    label: string
    mapFunction?: (value: string) => { label: string }
  }[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  buttonConfig,
  filterColumns,
}: DataTableProps<TData, TValue> & ButtonConfigProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const headerGroups = table.getHeaderGroups()

  return (
    <div>
      <DataTableToolbar
        table={table}
        buttonConfig={buttonConfig}
        filterColumns={filterColumns}
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
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
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
      <DataTablePagination table={table} />
    </div>
  )
}
