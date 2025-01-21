'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginDataSchema, type LoginDataInput } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import loginUser from '../handle-login'

export function LoginForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginDataInput>({
    resolver: zodResolver(loginDataSchema),
  })

  function handleLoginSubmit(data: LoginDataInput) {
    const handleRequest = loginUser(data)
    toast.promise(handleRequest, {
      loading: 'Verificando credenciais...',
      success: () => {
        setTimeout(() => {
          redirect('/')
        }, 1000)
        return 'Logado com sucesso.'
      },
      error: 'Algo deu errado. Por favor, verifique suas credenciais.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleLoginSubmit)}
      className='flex space-y-6 pt-12 pb-20 flex-col'
    >
      <div className='space-y-3'>
        <div>
          <label htmlFor='email' className='text-primary text-sm'>
            E-mail
          </label>
          <Input
            id='email'
            {...register('email')}
            className='placeholder:text-sm'
            placeholder='e-mail da conta'
          />
          {errors.email && (
            <p className='text-destructive pt-0.5 text-sm'>
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor='password' className='text-primary text-sm'>
            Senha
          </label>

          <Input
            id='password'
            type='password'
            {...register('password')}
            placeholder='Senha'
            className='placeholder:text-sm'
          />
          {errors.password && (
            <p className='text-destructive pt-0.5 text-sm'>
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <Button>Entrar</Button>
    </form>
  )
}
