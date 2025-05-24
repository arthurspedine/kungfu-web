import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import type { DataTablePaginationProps } from './interfaces'

export function DataTablePagination<TData>({
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: DataTablePaginationProps) {
  const canPreviousPage = currentPage > 0
  const canNextPage = currentPage < totalPages - 1
  const pageSizeOptions = [10, 20, 30, 40, 50, 100]
  return (
    <div className='flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between lg:justify-end py-2 md:space-x-4'>
      <div className='flex flex-col lg:space-x-4 lg:flex-row lg:items-center'>
        {/* LINES PER PAGE */}
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Linhas por página</p>
          <Select
            value={String(pageSize)}
            onValueChange={value => onPageSizeChange(Number(value))}
            disabled={loading}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* PAGE COUNT */}
        <p className='min-w-24 lg:text-center text-sm font-medium'>
          Página {currentPage + 1} de {totalPages}
        </p>
      </div>
      {/* BUTTONS */}
      <div className='flex space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(0)}
          disabled={!canPreviousPage || loading}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPreviousPage || loading}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNextPage || loading}
        >
          <ChevronRight />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(totalPages - 1)}
          disabled={!canNextPage || loading}
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  )
}
