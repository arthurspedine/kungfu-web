'use server'
import logo from '&/public/logo.svg'
import { getUserInfo } from '@/http/get-user-info'
import type { NavigationProp } from '@/types'
import { MapPin, User } from 'lucide-react'
import Image from 'next/image'
import { LogOutButton } from './logout-button'
import { NavigationMenu } from './navigation-menu'

export async function MenuSidebar() {
  const userInfo: { name: string; email: string } = await getUserInfo()

  const navigation_links: NavigationProp[] = [
    {
      id: 1,
      path: '/training_centers',
      label: 'Núcleos',
      icon: <MapPin />,
    },
    {
      id: 2,
      path: '/students',
      label: 'Alunos',
      icon: <User />,
    },
  ]

  return (
    <div className='w-72 h-full bg-secondary space-y-8 px-6 shadow-xl'>
      <Image
        src={logo}
        alt='Kung Fu Taishan Logo'
        className='pb-4 mx-auto w-44 pt-8'
      />

      {/* USER CARD */}
      <div className='bg-white w-60 border border-border rounded-xl flex items-center space-x-4 py-4 px-6'>
        <div className='text-primary'>
          <h2 className='font-bold'>{userInfo.name}</h2>
          <p className='text-xs'>{userInfo.email}</p>
        </div>
        <LogOutButton />
      </div>

      {/* NAVIGATION */}
      <NavigationMenu links={navigation_links} />
    </div>
  )
}
