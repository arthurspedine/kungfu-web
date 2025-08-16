import { Logo } from '@/components/logo'
import { Title } from '@/components/title'
import { LoginForm } from './_components/login-form'
import { LoginImageSide } from './_components/login-image-side'

export default function LoginPage() {
  return (
    <div className='flex h-full w-full bg-secondary py-6 overflow-y-auto'>
      {/* LOGIN SIDE */}
      <div className='w-full flex flex-col px-12 justify-center lg:w-1/2'>
        <Logo />
        <Title className='text-primary'>Seja bem vindo,</Title>
        <span className='text-primary'>
          Insira seu email e senha para acesso.
        </span>
        <LoginForm />
      </div>
      {/* IMAGE SIDE */}
      <LoginImageSide />
    </div>
  )
}
