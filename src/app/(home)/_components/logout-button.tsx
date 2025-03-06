'use client'
import { logout } from '@/http/auth'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LogOutButton() {
  const router = useRouter()
  return (
    <button
      type='button'
      onClick={async () => {
        await logout()
        router.refresh()
      }}
    >
      <LogOut color='#dfe4e7' />
    </button>
  )
}
