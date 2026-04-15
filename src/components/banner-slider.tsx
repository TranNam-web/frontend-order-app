'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

export default function BannerSlider() {
  const banners = [
    '/banner1.jpg',
    '/banner2.jpg',
    '/banner3.jpg'
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop={true}
        className="rounded-2xl overflow-hidden"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[250px]">
<Image
  src={banner}
  alt="banner"
  fill
  priority
  quality={100}
  className="object-cover"
/>

              {/* overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h1 className="text-3xl md:text-5xl font-bold">
                  🍽 Quán Ăn Vặt Trần Nam
                </h1>

                <p className="mt-3 text-lg">
                  Vị ngon trong khoảnh khắc
                </p>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}