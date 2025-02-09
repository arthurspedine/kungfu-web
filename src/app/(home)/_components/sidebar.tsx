'use server'
import Image from 'next/image'
import logo from '&/public/logo.svg'
import { getUserInfo } from '@/http/get-user-info'
import { LogOutButton } from './logout-button'
import { MapPin, User } from 'lucide-react'

export async function MenuSidebar() {
  const userInfo: { name: string; email: string } = await getUserInfo()

  return (
    <div className='w-72 h-full bg-[#F5F7F9] space-y-8 px-6'>
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
      <div className='space-y-1'>
        <p className='font-bold text-sm'>Navegação</p>
        {/* CARD 1 */}
        <div className='bg-white border border-border py-2 px-4 rounded-xl'>
          <p className='flex gap-1 items-center text-[#B02837]'>
            <User /> Alunos
          </p>
        </div>
        {/* CARD 2 */}
        <div className='py-2 px-4'>
          <p className='flex gap-1 items-center'>
            <MapPin /> Núcleos
          </p>
        </div>
      </div>
    </div>
  )
}
