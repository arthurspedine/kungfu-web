import type { Column } from '@tanstack/react-table'
import { Check, PlusCircle } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  const options = facets
    ? Array.from(facets.entries()).map(([value, count]) => ({
        label: value,
        value: value,
        count: count,
      }))
    : []

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className='h-10 w-full xl:w-auto'>
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-6' />
              <Badge variant={'secondary'} className='rounded-sm px-1'>
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Sem resultados.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className='mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary'
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--primary)'
                          : 'transparent',
                        color: isSelected
                          ? 'var(--primary-foreground)'
                          : 'inherit',
                        opacity: isSelected ? 1 : 0.5,
                      }}
                    >
                      <Check className={isSelected ? 'visible' : 'invisible'} />
                    </div>
                    <span className='text-nowrap'>{option.label}</span>
                    {option.count && (
                      <span className='ml-auto flex h-4 w-4 items-center justify-center text-xs'>
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className='justify-center text-center'
                  >
                    Limpar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
