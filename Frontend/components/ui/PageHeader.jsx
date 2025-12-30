import Link from 'next/link'

export default function PageHeader({ title, breadcrumbs }) {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
          {title}
        </h1>
        <nav className="flex justify-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900">{crumb.label}</span>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

