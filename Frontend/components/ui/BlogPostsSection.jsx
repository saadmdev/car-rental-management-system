import Link from 'next/link'

export default function BlogPostsSection() {
  const posts = [
    {
      id: 1,
      title: 'How To Choose The Right Car',
      category: 'News',
      date: '12April 2024',
      image: '/assets/blog-1.jpg',
    },
    {
      id: 2,
      title: 'Which plan is right for me?',
      category: 'News',
      date: '12April 2024',
      image: '/assets/blog-2.jpg',
    },
    {
      id: 3,
      title: 'Enjoy Speed, Choice & Total Control',
      category: 'News',
      date: '12April 2024',
      image: '/assets/blog-3.jpg',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Latest blog posts & news
        </h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={post.id === 1 
                      ? 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'
                      : post.id === 2
                      ? 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop'
                      : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop'
                    }
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {post.category} / {post.date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

