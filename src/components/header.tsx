import Link from 'next/link'
import { Title } from './title'
import { Button } from './ui/button'

export function Header() {
  return (
    <div className='flex justify-between items-center max-w-app mx-auto w-full py-4 px-2'>
      <Link href={'/'}>
        <Title>Kung Fu Taishan</Title>
      </Link>
      <div className='flex items-center space-x-2'>
        <Button asChild>
          <Link href={'/auth/login'}>Entrar</Link>
        </Button>
      </div>
    </div>
  )
}
