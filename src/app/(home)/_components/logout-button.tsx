'use client'
import { logout } from '@/http/auth'
import { LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'

export function LogOutButton() {
  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      redirect('/auth/login')
    }
  }
  return (
    <button type='button' onClick={handleLogout}>
      <LogOut color='#dfe4e7' />
    </button>
  )
}
