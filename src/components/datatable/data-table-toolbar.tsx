import { PlusCircle, X } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Button } from '../ui/button'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import type { ButtonConfigProps, DataTableToolbarProps } from './interfaces'

export function DataTableToolbar<TData>({
  table,
  buttonConfig,
  filterColumns,
  loading = false,
}: DataTableToolbarProps<TData> & ButtonConfigProps) {
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div className='w-full pb-4 flex flex-col justify-between gap-2 xl:flex-col xl:gap-0 xl:items-center'>
      <Button
        variant={'green'}
        onClick={() => redirect(buttonConfig.redirectTo ?? '')}
        className='xl:ml-auto'
        disabled={loading}
      >
        <PlusCircle /> {buttonConfig.label}
      </Button>
      <div className='w-full gap-2 flex flex-col items-center xl:flex-row xl:pt-2'>
        {filterColumns.map(c => {
          const tableColumn = table.getColumn(c.id)
          if (tableColumn)
            return (
              <DataTableFacetedFilter
                key={c.id}
                column={tableColumn}
                title={c.label}
                mapFunction={c.mapFunction}
                disabled={loading}
              />
            )
        })}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-10 w-full px-2 lg:w-fit lg:px-3'
          >
            Limpar filtros
            <X />
          </Button>
        )}
      </div>
    </div>
  )
}
