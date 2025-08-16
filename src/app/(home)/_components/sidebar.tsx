'use client'
import logo from '&/public/logo.svg'
import type { NavigationProp } from '@/types'
import { LayoutGrid, Menu, Users } from 'lucide-react'
import Image from 'next/image'
import { LogOutButton } from './logout-button'
import { NavigationMenu } from './navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getUserInfo } from '@/http/get-user-info'

type UserRole = 'TEACHER' | 'MASTER' | 'ADMIN'

const roleLabels: Record<UserRole, string> = {
  TEACHER: 'Professor',
  MASTER: 'Mestre',
  ADMIN: 'Admin',
}

const roleColors: Record<UserRole, string> = {
  TEACHER: 'bg-blue-100 text-blue-800',
  MASTER: 'bg-primary-red text-white',
  ADMIN: 'bg-yellow-300 text-yellow-900',
}

const navigation_links: NavigationProp[] = [
  {
    id: 1,
    path: '/training_centers',
    label: 'Núcleos',
    icon: <LayoutGrid className='size-4' />,
  },
  {
    id: 2,
    path: '/students',
    label: 'Alunos',
    icon: <Users className='size-4' />,
  },
]

type UserInfo = {
  name: string
  email: string
  role: UserRole
}

export function MenuSidebar() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo()
        setUserInfo(info)
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  if (isLoading || !userInfo) {
    return (
      <div className='w-72 h-full bg-secondary space-y-8 px-6 shadow-xl'>
        {/* Loading skeleton */}
        <div className='h-20 animate-pulse bg-gray-200 rounded mt-8' />
      </div>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild className='lg:hidden'>
        <Button
          variant='outline'
          size='icon'
          className='fixed top-6 right-4 z-50'
        >
          <Menu className='size-4' />
          <span className='sr-only'>Abrir menu</span>
        </Button>
      </SheetTrigger>

      {/* Desktop Sidebar */}
      <div className='hidden lg:block lg:w-72 h-full bg-secondary space-y-8 px-6 shadow-xl'>
        <SidebarContent
          userInfo={userInfo}
          navigation_links={navigation_links}
        />
      </div>

      {/* Mobile Sidebar */}
      <SheetContent side='left' className='w-72 p-0'>
        <SheetHeader className='text-left p-6 pb-0'>
          <SheetTitle className='sr-only'>Menu de Navegação</SheetTitle>
          <SheetDescription className='sr-only'>
            Logo do Kung Fu Taishan, informações do usuário e lista de
            navegação.
          </SheetDescription>
        </SheetHeader>
        <SidebarContent
          userInfo={userInfo}
          navigation_links={navigation_links}
          mobile
        />
      </SheetContent>
    </Sheet>
  )
}

function SidebarContent({
  userInfo,
  navigation_links,
  mobile,
}: {
  userInfo: UserInfo
  navigation_links: NavigationProp[]
  mobile?: boolean
}) {
  return (
    <div className={`${mobile ? 'px-6 pt-8' : 'h-full pt-8'}`}>
      <Image
        src={logo}
        alt='Kung Fu Taishan Logo'
        className='pb-4 mx-auto w-44'
      />

      {/* USER CARD */}
      <div className='bg-white w-60 border border-border rounded-xl flex items-center justify-between p-4 mb-6'>
        <div className='text-primary'>
          <h2 className='font-bold text-sm'>{userInfo.name}</h2>
          <p className='text-xs text-muted-foreground'>{userInfo.email}</p>
          <div
            className={`px-2 py-1 rounded text-xs inline-block font-medium mt-1 ${roleColors[userInfo.role]}`}
          >
            {roleLabels[userInfo.role]}
          </div>
        </div>
        <LogOutButton />
      </div>

      {/* NAVIGATION */}
      <NavigationMenu links={navigation_links} />
    </div>
  )
}
