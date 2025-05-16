"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

type ProductImageGalleryProps = {
  images: string[]
  productName: string
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleOpenFullscreen = () => {
    setIsOpen(true)
  }

  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-md mb-4">
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${productName} - Image ${currentIndex + 1}`}
            fill
            className="object-contain"
          />
          <button
            onClick={handleOpenFullscreen}
            className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            aria-label="View fullscreen"
          >
            <Maximize className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`w-20 h-20 relative flex-shrink-0 border rounded overflow-hidden ${
                currentIndex === index ? "border-[#0CC0DF] ring-2 ring-[#0CC0DF]/20" : "border-gray-200"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
