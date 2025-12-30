export default function MobileApp({ variant = 'default' }) {
  if (variant === 'purple') {
    return (
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Phone Mockup */}
            <div className="relative h-96 flex items-center justify-center order-2 lg:order-1">
              <div className="relative w-48 h-96">
                <div className="absolute z-10 w-48 h-96 bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-900 p-2">
                  <div className="w-full h-full bg-gray-100 rounded-[2rem]"></div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <p className="text-sm uppercase tracking-wider text-white/80">DOWNLOAD OUR APP</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Download our app
              </h2>
              <p className="text-white/90 text-lg">
                Download our mobile app for the ultimate convenience. Book cars on the go, manage your reservations, 
                track your rental, and access exclusive mobile-only deals. Available for both iOS and Android devices.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Download mobile app
            </h2>
            <p className="text-gray-600 text-lg">
              Take your car rental experience with you wherever you go. Our mobile app makes it easy to browse vehicles, 
              make reservations, manage your bookings, and get instant support - all from your smartphone.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* App Store Button */}
              <button className="flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>

              {/* Google Play Button */}
              <button className="flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Phone Mockups */}
          <div className="relative h-96 flex items-center justify-center">
            <div className="relative w-48 h-96">
              {/* Front Phone */}
              <div className="absolute z-10 w-48 h-96 bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-900 p-2">
                <div className="w-full h-full bg-gray-100 rounded-[2rem]"></div>
              </div>
              {/* Back Phone */}
              <div className="absolute z-0 left-12 top-8 w-48 h-96 bg-white rounded-[2.5rem] shadow-xl border-8 border-gray-900 p-2 opacity-75 transform rotate-6">
                <div className="w-full h-full bg-gray-100 rounded-[2rem]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

