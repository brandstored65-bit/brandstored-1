'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const Section4 = ({ sections }) => {
  const router = useRouter()

  if (!sections || sections.length === 0) return null

  return (
    <div className="w-full bg-white py-6">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Horizontal Scrollable Grid Sections */}
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {sections.map((section, sectionIdx) => (
            <GridSection key={section._id || sectionIdx} section={section} router={router} />
          ))}
        </div>
      </div>
    </div>
  )
}

const GridSection = ({ section, router }) => {
  const sliderRef = useRef(null)
  const { title, category, products = [] } = section

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 350
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const hasSlider = products.length > 4

  return (
    <div className="min-w-[380px] md:min-w-[420px] flex-shrink-0 snap-start bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white">
        <h3 className="text-xl font-bold text-gray-900">{title || category}</h3>
        <button
          onClick={() => router.push(`/shop?category=${category}`)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition flex-shrink-0 shadow-sm"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Products Grid/Slider */}
      <div className="relative px-4 pb-5">
        {hasSlider && (
          <>
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border-2 border-gray-300 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border-2 border-gray-300 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </>
        )}

        <div
          ref={sliderRef}
          className={`${hasSlider ? 'flex gap-4 overflow-x-auto scrollbar-hide' : 'grid grid-cols-2 gap-4'}`}
        >
          {products.map((product, idx) => (
            <div
              key={product._id || idx}
              onClick={() => router.push(`/product/${product.slug}`)}
              className={`bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group border border-gray-200 ${hasSlider ? 'min-w-[180px] flex-shrink-0' : ''}`}
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={product.image || product.images?.[0] || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                    {product.discount}
                  </div>
                )}
                {product.badge && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5 leading-tight">
                  {product.name}
                </h4>
                
                {product.offer && (
                  <p className="text-xs font-bold text-green-600">
                    {product.offer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Section4