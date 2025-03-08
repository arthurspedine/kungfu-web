'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { UseFormClearErrors, UseFormSetValue } from 'react-hook-form'

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
]

export function TeacherCombobox({
  setValue,
  clearErrors,
  teachersList,
}: {
  setValue: UseFormSetValue<{
    teacherId: string
    name: string
    street: string
    additionalAddress: string
    city: string
    state: string
    zipCode: string
    openingDate: string
    number?: number | undefined
  }>
  clearErrors: UseFormClearErrors<{
    teacherId: string
    name: string
    street: string
    additionalAddress: string
    city: string
    state: string
    zipCode: string
    openingDate: string
    number?: number | undefined
  }>
  teachersList: { id: string; name: string }[]
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setComboBoxValue] = React.useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          aria-expanded={open}
          className='w-80 justify-between text-muted-foreground font-normal'
        >
          {value
            ? teachersList.find(teacher => teacher.id === value)?.name
            : 'Selecione o professor docente'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w- p-0'>
        <Command>
          <CommandInput placeholder='Digite o nome do professor docente...' />
          <CommandList>
            <CommandEmpty>Nenhum professor encontrado.</CommandEmpty>
            <CommandGroup>
              {teachersList.map(teacher => (
                <CommandItem
                  key={teacher.id}
                  value={teacher.name}
                  onSelect={() => {
                    setComboBoxValue(teacher.id)
                    setValue('teacherId', teacher.id)
                    clearErrors('teacherId')
                    setOpen(false)
                  }}
                  className='text-nowrap'
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === teacher.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {teacher.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
