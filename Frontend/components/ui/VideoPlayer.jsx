import { Play } from 'lucide-react'

export default function VideoPlayer() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
          {/* Background Image */}
          <img
            src="https://aaa.scene7.com/is/image/acg/car-rentals:mobile?ts=1730892956189&bfc=on&network=on&dirt_feature=smart_imaging&dpr=off"
            alt="Car rental service video"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Play Button */}
          <button className="absolute inset-0 flex items-center justify-center group">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" fill="white" />
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}

