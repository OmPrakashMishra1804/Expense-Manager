import React, { useState, useEffect, ReactNode } from 'react'

interface CarouselProps {
  children: ReactNode[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ children: slides, autoSlide = false, autoSlideInterval = 3000 }) => {
  const [curr, setCurr] = useState<number>(0)
  const next = () => setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))

  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [autoSlide, autoSlideInterval])

  return (
    <div className='overflow-hidden relative'>
      <div className='flex transition-transform ease-out duration-500' style={{ transform: `translateX(-${curr * 100}%)` }}>
        {slides}
      </div>
      <div className='absolute bottom-4 right-0 left-0'>
        <div className='flex items-center justify-center gap-2'>
          {slides.map((_, i: number) => (
            <div key={i} className={`transition-all w-1.5 h-1.5 bg-white rounded-full  ${curr === i ? "p-0.5" : "bg-opacity-50"}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel