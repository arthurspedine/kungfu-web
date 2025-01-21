'use client'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function ImageSlider({
  images,
  interval = 12000,
}: { images: { id: number; path: StaticImageData }[]; interval?: number }) {
  if (!images || images.length === 0) {
    return (
      <div className='w-full h-full rounded-2xl mx-auto bg-gray-200 flex items-center justify-center'>
        <p className='text-gray-500'>No images to display</p>
      </div>
    )
  }

  const [currentIndex, setCurrentIndex] = useState(0)

  // auto advance slides
  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        const newIndex = prev === images.length - 1 ? 0 : prev + 1
        return newIndex
      })
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  // const showNavigation = images.length > 1

  return (
    <div className='relative w-full mx-auto'>
      {/* Main image container */}
      <div className='relative h-full overflow-hidden rounded-lg'>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute w-full h-full transition-all duration-700 ease-in-out rounded-2xl
              ${
                index === currentIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-110'
              }`}
          >
            <Image
              src={image.path}
              alt={`Slide ${index + 1}`}
              className='object-cover w-full h-full rounded-2xl'
            />
          </div>
        ))}
      </div>
    </div>
  )
}
