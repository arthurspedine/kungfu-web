'use client'
import writing from '&/public/taishan_writing.png'
import image1 from '@/assets/carousel-images/photo1.jpg'
import image2 from '@/assets/carousel-images/photo2.jpg'
import image3 from '@/assets/carousel-images/photo3.jpg'
import image4 from '@/assets/carousel-images/photo4.jpg'
import image5 from '@/assets/carousel-images/photo5.jpg'
import Image, { type StaticImageData } from 'next/image'
import { useEffect, useState } from 'react'
import { ImageSlider } from './image-slider'

export function LoginImageSide() {
  const images: { id: number; path: StaticImageData }[] = [
    { id: 1, path: image1 },
    { id: 2, path: image2 },
    { id: 3, path: image3 },
    { id: 4, path: image4 },
    { id: 5, path: image5 },
  ]

  const [shouldRenderSlider, setShouldRenderSlider] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkScreenSize = () => {
        setShouldRenderSlider(window.innerWidth >= 1024)
      }

      checkScreenSize()

      window.addEventListener('resize', checkScreenSize)

      return () => window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  return (
    <div className='relative hidden w-1/2 flex-grow pr-12 pl-6 xl:px-12 lg:flex'>
      <Image
        src={writing}
        alt=''
        className='w-[400px] bottom-0 absolute z-10'
      />

      {shouldRenderSlider && <ImageSlider images={images} />}
    </div>
  )
}
