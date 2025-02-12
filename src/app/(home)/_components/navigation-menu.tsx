'use client'

import type { NavigationProp } from '@/types'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function NavigationMenu({ links }: { links: NavigationProp[] }) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') redirect(links[0].path)
  }, [pathname, links])

  return (
    <div className='space-y-1'>
      <p className='font-bold text-sm'>Navegação</p>
      {links.map(link => (
        <Link
          href={link.path}
          key={link.id}
          className={`py-2 px-4 rounded-xl flex gap-1 items-center ${pathname.startsWith(link.path) && 'border border-border bg-white text-[#B02837]'}`}
        >
          {link.icon} {link.label}
        </Link>
      ))}
    </div>
  )
}
