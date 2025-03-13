'use client'

import { Label } from '@/components/label'
import { Input } from '@/components/ui/input'
import { TeacherCombobox } from './teacher-combobox'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type { ViaCEPType } from '@/types'
import { useForm } from 'react-hook-form'
import { addTrainingCenterSchema, type AddTrainingCenterType } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Skeleton } from '@/components/ui/skeleton'
import { handleAddTrainingCenter } from '@/http/training-centers'
import { toast } from 'sonner'

export function AddTrainingCenterForm({
  teachers,
}: { teachers: { id: string; name: string }[] }) {
  const router = useRouter()

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    setError,
    getValues,
    clearErrors,
  } = useForm<AddTrainingCenterType>({
    resolver: zodResolver(addTrainingCenterSchema),
  })

  const [currentCep, setCurrentCep] = useState('')
  const [disabledInputs, setDisabledInputs] = useState(true)
  const [loading, setLoading] = useState(false)

  function handleCepInputChange(value: string) {
    const numericValue = value.replace(/\D/g, '')

    if (!numericValue) {
      setCurrentCep('')
      return
    }
    const truncatedValue = numericValue.slice(0, 8)

    let formattedValue = truncatedValue
    if (truncatedValue.length > 5) {
      formattedValue = `${truncatedValue.slice(0, 5)}-${truncatedValue.slice(5)}`
    }

    setCurrentCep(formattedValue)

    if (truncatedValue.length === 8) {
      validateCep(formattedValue)
    }
  }

  async function validateCep(cep: string) {
    if (cep.replace('-', '').length !== 8) {
      setError('zipCode', { message: 'Cep inválido.' })
      setDisabledInputs(true)
      return false
    }
    setLoading(true)
    const response = await fetch(
      `https://viacep.com.br/ws/${cep.replace('-', '')}/json/`
    )
    const data: ViaCEPType = await response.json()

    if (data.erro || data.cep !== cep) {
      setError('zipCode', { message: 'Cep inválido.' })
      setDisabledInputs(true)
      setLoading(false)
      return false
    }
    setDisabledInputs(false)
    syncValues(data)
    setLoading(false)
    return true
  }

  function syncValues(data: ViaCEPType) {
    setValue('street', data.logradouro)
    setValue('city', data.localidade)
    setValue('state', data.uf)
    setValue('zipCode', data.cep)
    clearErrors(['street', 'city', 'state', 'number', 'zipCode'])
  }

  async function handleFormSubmit(data: AddTrainingCenterType) {
    const isValidCep = await validateCep(data.zipCode)
    if (!isValidCep) return
    const addTrainingCenterRequest = handleAddTrainingCenter(data)

    toast.promise(addTrainingCenterRequest, {
      loading: 'Cadastrando núcleo...',
      success: () => {
        router.replace('/training_centers')
        return 'Núcleo cadastrado com sucesso!'
      },
      error: err => {
        if (err.error) return err.error
        return 'Algo deu errado ao cadastrar o núcleo.'
      },
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <form
      className='flex flex-col w-full space-y-2 xl:space-y-0 xl:space-x-8 xl:flex-row'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className='w-full space-y-2 xl:w-1/2'>
        <div>
          <Label>Nome do Núcleo</Label>
          <Input placeholder='Digite o nome do núcleo' {...register('name')} />
          {errors.name && (
            <p className='text-destructive text-sm pt-0.5'>
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label>Código Postal</Label>
          <Input
            placeholder='Digite o código postal do núcleo'
            value={currentCep}
            min={0}
            {...register('zipCode', {
              onChange: e => handleCepInputChange(e.target.value),
            })}
          />
          {errors.zipCode && (
            <p className='text-destructive text-sm pt-0.5'>
              {errors.zipCode.message}
            </p>
          )}
        </div>
        <div>
          <Label>Endereço</Label>
          {loading ? (
            <Skeleton className='h-9 w-full' />
          ) : (
            <Input
              placeholder='Digite o endereço do núcleo'
              disabled={disabledInputs}
              {...register('street')}
            />
          )}
          {errors.street && (
            <p className='text-destructive text-sm pt-0.5'>
              {errors.street.message}
            </p>
          )}
        </div>
        <div className='flex space-x-4'>
          <div className='w-1/3'>
            <Label>Número</Label>
            {loading ? (
              <Skeleton className='h-9 w-full' />
            ) : (
              <Input
                value={
                  getValues('number') === undefined ||
                  getValues('number') === null
                    ? 0
                    : getValues('number')
                }
                placeholder='Digite o número do núcleo'
                disabled={disabledInputs}
                type='number'
                {...register('number', {
                  onChange: e => {
                    if (e.target.value === '') {
                      setValue('number', 0, { shouldValidate: true })
                    } else {
                      const numValue = Number(e.target.value)
                      setValue('number', numValue, { shouldValidate: true })
                    }
                  },
                })}
              />
            )}
            {errors.number && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.number.message}
              </p>
            )}
          </div>
          <div className='w-2/3'>
            <Label>Complemento</Label>
            {loading ? (
              <Skeleton className='h-9 w-full' />
            ) : (
              <Input
                placeholder='Digite o complemento do núcleo'
                disabled={disabledInputs}
                type='text'
                {...register('additionalAddress')}
              />
            )}
            {errors.additionalAddress && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.additionalAddress.message}
              </p>
            )}
          </div>
        </div>
        <div className='flex space-x-4 w-full'>
          <div className='w-1/2'>
            <Label>Cidade</Label>
            {loading ? (
              <Skeleton className='h-9 w-full' />
            ) : (
              <Input
                placeholder='Digite a cidade'
                disabled={disabledInputs}
                {...register('city')}
              />
            )}
            {errors.city && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.city.message}
              </p>
            )}
          </div>
          <div className='w-1/2'>
            <Label>Estado</Label>
            {loading ? (
              <Skeleton className='h-9 w-full' />
            ) : (
              <Input
                placeholder='Digite o estado'
                disabled={disabledInputs}
                {...register('state')}
              />
            )}
            {errors.state && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.state.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col space-y-2 justify-between xl:w-1/2 xl:space-y-0'>
        <div className='space-y-2'>
          <div>
            <Label>Professor Docente</Label>
            <TeacherCombobox
              setValue={setValue}
              clearErrors={clearErrors}
              teachersList={teachers}
            />
            {errors.teacherId && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.teacherId.message}
              </p>
            )}
          </div>
          <div>
            <Label>Data de Inauguração</Label>
            <Input type='date' {...register('openingDate')} className='w-40' />
            {errors.openingDate && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.openingDate.message}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col space-y-2 xl:self-end xl:space-y-0 xl:space-x-4 xl:flex-row'>
          <Button
            variant={'outline'}
            className='w-full xl:w-48'
            type='button'
            onClick={() => router.push('/training_centers')}
          >
            Cancelar
          </Button>
          <Button variant={'green'} className='w-full xl:w-48'>
            Cadastrar
          </Button>
        </div>
      </div>
    </form>
  )
}
