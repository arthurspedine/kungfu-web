import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import icon from '&/public/favicon.ico'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Kung Fu Taishan',
  description: 'Site da união Taishan de Kung Fu',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <head>
        <link rel='icon' href={icon.src} sizes='any' />
      </head>
      <body className={`${inter.className} antialiased`}>
        <main className='flex flex-col h-screen w-full scroll-smooth'>
          {children}
          <Toaster theme='light' richColors />
        </main>
      </body>
    </html>
  )
}
