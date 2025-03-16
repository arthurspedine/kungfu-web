import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import type { DataTablePaginationProps } from './interfaces'

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
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
            <SelectTrigger className='h-8 w-[70px]' size='36'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
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
  )
}
