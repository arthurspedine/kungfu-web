'use client'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  type Column,
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
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from 'lucide-react'
import { useMemo, useState } from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function TrainingCentersDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
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

  const filterHeaders = [
    { headerName: 'name', selectHeader: 'Núcleo' },
    { headerName: 'teacher_name', selectHeader: 'Professor Docente' },
    { headerName: 'city', selectHeader: 'Cidade' },
    { headerName: 'state', selectHeader: 'Estado' },
  ]

  return (
    <div>
      <div className='w-full py-4 flex flex-col-reverse gap-4 md:flex-row xl:items-center md:gap-0 md:space-x-4'>
        {headerGroups.map(headerGroup => (
          <div
            key={headerGroup.id}
            className='flex space-y-2 xl:space-y-0 xl:space-x-4 w-full flex-col xl:flex-row'
          >
            {headerGroup.headers.map(header => {
              const headerName = header.id
              if (headerName) {
                const headerObject = filterHeaders.find(
                  h => h.headerName === headerName
                )
                if (headerObject) {
                  return (
                    <Filter
                      column={header.column}
                      key={header.id}
                      headerValue={headerObject.selectHeader}
                    />
                  )
                }
              }
            })}
          </div>
        ))}
        <Button variant={'green'}>
          <Plus /> Cadastrar Núcleo
        </Button>
      </div>
      <div className='border border-[#CACACA] rounded-xl w-full overflow-auto'>
        <Table className='bg-[##F5F5F5]'>
          <TableHeader>
            {headerGroups.map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className='text-nowrap'>
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
          <TableBody className='bg-[#FEFEFE]'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
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
      {table.getRowModel().rows?.length > 0 && (
        <div className='flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between lg:justify-end py-2 md:space-x-4'>
          <div className='flex flex-col lg:space-x-4 lg:flex-row lg:items-center'>
            {/* LINES PER PAGE */}
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium'>Linhas por página</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={value => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className='h-8 w-[70px]'>
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* PAGE COUNT */}
            <p className='min-w-24 lg:text-center text-sm font-medium'>
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </p>
          </div>
          {/* BUTTONS */}
          <div className='flex space-x-2'>
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Filter({
  column,
  headerValue,
}: { column: Column<any, unknown>; headerValue: string }) {
  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues: string[] = useMemo(
    () =>
      Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 5000),
    [column]
  )

  const clearFilterTag = 'clear filter'

  return (
    <Select
      onValueChange={e => {
        column.setFilterValue(e === clearFilterTag ? '' : e)
      }}
      value={columnFilterValue?.toString() || ''}
    >
      <SelectTrigger header={headerValue}>
        <SelectValue placeholder='Selecione' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={clearFilterTag}>Todos</SelectItem>
        {sortedUniqueValues.map(value => (
          <SelectItem value={value} key={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
