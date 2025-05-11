'use client'

import { SheetClose } from '@/components/ui/sheet'
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
        <SheetClose asChild key={link.id}>
          <Link
            href={link.path}
            className={`py-2 px-4 rounded-xl flex gap-1 items-center ${pathname.startsWith(link.path) && 'border border-border bg-background text-primary-red shadow-md'}`}
          >
            {link.icon} {link.label}
          </Link>
        </SheetClose>
      ))}
    </div>
  )
}
