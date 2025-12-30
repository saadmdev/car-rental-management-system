'use client'

export default function CarBrandsSection() {
  const brands = [
    { 
      id: 1, 
      name: 'Toyota',
      logo: 'https://1000logos.net/wp-content/uploads/2018/02/Toyota-logo.png'
    },
    { 
      id: 2, 
      name: 'Ford',
      logo: 'https://1000logos.net/wp-content/uploads/2018/02/Ford-Logo-500x281.png'
    },
    { 
      id: 3, 
      name: 'Mercedes-Benz',
      logo: 'https://1000logos.net/wp-content/uploads/2018/04/Mercedes-Benz-Logo.png'
    },
    { 
      id: 4, 
      name: 'Jeep',
      logo: 'https://1000logos.net/wp-content/uploads/2018/04/Jeep-logo-500x281.png'
    },
    { 
      id: 5, 
      name: 'BMW',
      logo: 'https://1000logos.net/wp-content/uploads/2018/02/BMW-Logo-500x281.png'
    },
    { 
      id: 6, 
      name: 'Audi',
      logo: 'https://1000logos.net/wp-content/uploads/2018/05/logo-Audi-500x173.png'
    },
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-center w-full h-16 opacity-60 hover:opacity-100 transition-opacity"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

