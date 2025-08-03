'use client'

import logo from '&/public/logo.svg'

export function Logo() {
  return (
    <img
      src={logo.src}
      alt='Kung Fu Taishan Logo'
      className='pb-4 mx-auto w-auto h-64'
    />
  )
}
