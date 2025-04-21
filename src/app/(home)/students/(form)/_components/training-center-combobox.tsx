'use client'

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
import { cn } from '@/lib/utils'
import type { TrainingCenterSimpleInfo } from '@/types'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { UseFormClearErrors, UseFormSetValue } from 'react-hook-form'

interface TrainingCenterComboboxProps {
  setValue: UseFormSetValue<{
    student: {
      name: string
      birthDate: string
      sex: 'M' | 'F'
    }
    belts: {
      type: string
      achievedDate: string
    }[]
    trainingCenterId: string
  }>
  clearErrors: UseFormClearErrors<{
    student: {
      name: string
      birthDate: string
      sex: 'M' | 'F'
    }
    belts: {
      type: string
      achievedDate: string
    }[]
    trainingCenterId: string
  }>
  trainingCenterList: TrainingCenterSimpleInfo[]
  initialValue?: string
}

export function TrainingCenterCombobox({
  setValue,
  clearErrors,
  trainingCenterList,
  initialValue,
}: TrainingCenterComboboxProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setComboboxValue] = useState<string>('')

  useEffect(() => {
    if (initialValue) {
      setComboboxValue(initialValue)
      setValue('trainingCenterId', initialValue)
    }
  }, [initialValue, setValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          aria-expanded={open}
          className={`w-full justify-between font-normal ${value === '' && 'text-popover-foreground'}`}
        >
          {value
            ? trainingCenterList.find(
                trainingCenter => trainingCenter.id === value
              )?.name
            : 'Selecione o núcleo'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput placeholder='Digite o nome do núcleo...' />
          <CommandList>
            <CommandEmpty>Nenhum núcleo encontrado.</CommandEmpty>
            <CommandGroup>
              {trainingCenterList.map(trainingCenter => (
                <CommandItem
                  key={trainingCenter.id}
                  value={trainingCenter.name}
                  onSelect={() => {
                    const id = trainingCenter.id
                    setComboboxValue(id)
                    setValue('trainingCenterId', id)
                    clearErrors('trainingCenterId')
                    setOpen(false)
                  }}
                  className='text-nowrap flex items-center cursor-pointer'
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === trainingCenter.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className='flex flex-col'>
                    {trainingCenter.name}
                    <span className='text-xs font-semibold'>
                      {trainingCenter.teacherName}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
