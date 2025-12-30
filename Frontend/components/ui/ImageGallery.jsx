'use client'

import { useState, useEffect } from 'react'

export default function ImageGallery({ images = [], carName }) {
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0])
    }
  }, [images])

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={carName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-car.jpg'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.slice(0, 3).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`flex-1 h-20 md:h-24 rounded-lg overflow-hidden ${
                selectedImage === image
                  ? 'ring-2 ring-primary'
                  : 'hover:opacity-80'
              }`}
            >
              <img
                src={image}
                alt={`${carName} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-car.jpg'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

