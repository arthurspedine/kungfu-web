'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { listAllBelts } from '@/http/belts'
import { getUserInfo } from '@/http/get-user-info'
import { handleAddStudent } from '@/http/students'
import { type FormStudentType, formStudentSchema } from '@/schemas'
import type { RequestBeltType, TrainingCenterSimpleInfo } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarFold, Eye, EyeOff, Trash, UserPlus } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TrainingCenterCombobox } from '../../_components/training-center-combobox'
import { validateBeltSequence } from '../../validate-belt-sequence'

export function AddStudentForm({
  trainingCenters,
}: { trainingCenters: TrainingCenterSimpleInfo[] }) {
  const [beltTypes, setBeltTypes] = useState<RequestBeltType[]>([])
  const [currentUserRole, setCurrentUserRole] = useState<
    'TEACHER' | 'MASTER' | 'ADMIN' | null
  >(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [createUser, setCreateUser] = useState(false)
  const lastBeltSelectRef = useRef<HTMLButtonElement>(null)

  const form = useForm<FormStudentType>({
    resolver: zodResolver(formStudentSchema),
    defaultValues: {
      student: {
        name: '',
        birthDate: '',
        sex: 'M',
      },
      belts: [{ type: '', achievedDate: '' }],
      trainingCenterId: null,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'belts',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [beltsResponse, userInfo] = await Promise.all([
          listAllBelts(),
          getUserInfo(),
        ])
        setBeltTypes(beltsResponse)
        setCurrentUserRole(userInfo.role)
      } catch (e) {
        toast.error('Houve um erro, por favor tente novamente mais tarde.')
        redirect('/students')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  function toggleCreateUser() {
    setCreateUser(!createUser)
    if (!createUser) {
      // When enabling user creation, set default values
      form.setValue('user', {
        email: '',
        password: '',
        role: 'TEACHER',
      })
    } else {
      // When disabling, remove the user object
      form.setValue('user', undefined)
    }
  }

  function handleFormSubmit(data: FormStudentType) {
    // If createUser is false but there is still user data, remove it
    if (!createUser && data.user) {
      data.user = undefined
    }

    const validationResult = validateBeltSequence(data.belts, beltTypes)
    if (!validationResult.isValid) {
      toast.error(validationResult.message, {
        position: 'top-center',
        duration: 10 * 1000,
        style: { filter: 'none', zIndex: 10 },
      })
      return
    }

    const handleRequest = handleAddStudent(data)
    toast.promise(handleRequest, {
      loading: 'Cadastrando aluno...',
      success: () => {
        setTimeout(() => {
          redirect('/students')
        }, 500)
        return 'Aluno cadastrado com sucesso!'
      },
      error: error => {
        if (error && typeof error === 'object' && error.message) {
          return error.message
        }
        if (typeof error === 'string') {
          return error
        }
        return 'Algo deu errado. Por favor, tente novamente.'
      },
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  function addNewBelt() {
    append({ type: '', achievedDate: '' })
    // Focus on the belt select field after a short delay to ensure it's rendered
    setTimeout(() => {
      if (lastBeltSelectRef.current) {
        lastBeltSelectRef.current.focus()
      }
    }, 100)
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Carregando...</CardTitle>
            <CardDescription>
              Aguarde enquanto carregamos as informações necessárias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='animate-pulse space-y-4'>
              <div className='h-4 bg-gray-200 rounded w-3/4' />
              <div className='h-4 bg-gray-200 rounded w-1/2' />
              <div className='h-4 bg-gray-200 rounded w-5/6' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className='space-y-6 pt-4'
      >
        {/* Switch to create user */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between flex-col sm:flex-row gap-2'>
              <div className='space-y-0.5'>
                <div className='text-base font-medium'>
                  Criar conta de usuário
                </div>
                <div className='text-sm text-muted-foreground'>
                  Marque esta opção se deseja criar uma conta de acesso ao
                  sistema para este aluno
                </div>
              </div>
              <Button
                type='button'
                variant={createUser ? 'default' : 'outline'}
                onClick={toggleCreateUser}
                className='sm:ml-4'
              >
                <UserPlus className='size-4 mr-2' />
                {createUser ? 'Criar Usuário' : 'Não Criar Usuário'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Student card info*/}
        {createUser && (
          <Card>
            <CardHeader>
              <CardTitle>Informações do Usuário</CardTitle>
              <CardDescription>
                Dados de acesso e permissões do usuário no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='user.email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Digite o email do usuário'
                          type='email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='user.password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            placeholder='Digite a senha'
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className='h-4 w-4' />
                            ) : (
                              <Eye className='h-4 w-4' />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='user.role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Papel do Usuário</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o papel do usuário' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='TEACHER'>Professor</SelectItem>
                        {(currentUserRole === 'MASTER' ||
                          currentUserRole === 'ADMIN') && (
                          <SelectItem value='MASTER'>Mestre</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Personal info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados pessoais do aluno</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <FormField
                control={form.control}
                name='student.name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Digite o nome completo do aluno'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='student.sex'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o sexo do aluno' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='M'>Masculino</SelectItem>
                        <SelectItem value='F'>Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='student.birthDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='trainingCenterId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Núcleo (Opcional)</FormLabel>
                    <TrainingCenterCombobox
                      setValue={form.setValue}
                      clearErrors={form.clearErrors}
                      trainingCenterList={trainingCenters}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Belts */}
        <Card>
          <CardHeader>
            <CardTitle>Faixas</CardTitle>
            <CardDescription>Histórico de faixas do aluno</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {fields.map((field, index) => (
              <div key={field.id} className='space-y-4'>
                <div className='flex flex-col gap-4 lg:flex-row lg:justify-between'>
                  <div className='flex flex-col gap-4 lg:flex-row lg:gap-4 flex-1'>
                    <FormField
                      control={form.control}
                      name={`belts.${index}.type`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormLabel>Faixa</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                ref={
                                  index === fields.length - 1
                                    ? lastBeltSelectRef
                                    : undefined
                                }
                              >
                                <SelectValue placeholder='Selecione a faixa' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {beltTypes && beltTypes.length > 0 ? (
                                beltTypes.map(belt => {
                                  const beltType = Object.keys(belt)[0]
                                  const beltLabel = belt[beltType]

                                  const isAlreadySelected = form
                                    .getValues('belts')
                                    .some(
                                      (selectedBelt, i) =>
                                        selectedBelt.type === beltType &&
                                        i !== index
                                    )

                                  if (
                                    !isAlreadySelected ||
                                    field.value === beltType
                                  ) {
                                    return (
                                      <SelectItem
                                        key={beltType}
                                        value={beltType}
                                      >
                                        {beltLabel}
                                      </SelectItem>
                                    )
                                  }
                                  return null
                                })
                              ) : (
                                <SelectItem value='none' disabled>
                                  Carregando faixas...
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`belts.${index}.achievedDate`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormLabel>Data de início da faixa</FormLabel>
                          <FormControl>
                            <Input type='date' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex items-end gap-4'>
                    <div className='flex flex-col'>
                      <FormLabel>Data do fim da faixa</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button type='button' variant='outline'>
                              <CalendarFold className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side='bottom'>
                            <p>A data de término da faixa definida pelo</p>
                            <p>início da próxima faixa se for seguida</p>
                            <p>a sequência correta.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        onClick={() => remove(index)}
                      >
                        <Trash className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
                {index < fields.length - 1 && <Separator />}
              </div>
            ))}

            <Button
              type='button'
              variant='link'
              className='w-fit text-blue-600 underline p-0'
              onClick={addNewBelt}
            >
              Novo cadastro de faixa
            </Button>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className='flex flex-col-reverse gap-4 sm:flex-row'>
          <Button
            variant='outline'
            className='flex-1'
            type='button'
            onClick={() => redirect('/students')}
          >
            Cancelar
          </Button>
          <Button variant='green' className='flex-1'>
            Salvar Aluno
          </Button>
        </div>
      </form>
    </Form>
  )
}
