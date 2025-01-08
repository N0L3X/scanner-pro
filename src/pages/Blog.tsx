import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Zero-Day Vulnerabilities',
    excerpt: 'Learn about zero-day vulnerabilities, how they\'re discovered, and best practices for protection.',
    author: 'Sarah Connor',
    date: '2024-03-15',
    category: 'Security Research',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'
  },
  {
    id: 2,
    title: 'The Rise of AI in Cybersecurity',
    excerpt: 'Exploring how artificial intelligence is transforming the landscape of cybersecurity.',
    author: 'John Smith',
    date: '2024-03-10',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1'
  },
  {
    id: 3,
    title: 'Essential OSINT Techniques',
    excerpt: 'A comprehensive guide to open-source intelligence gathering for security professionals.',
    author: 'Mike Johnson',
    date: '2024-03-05',
    category: 'Tutorials',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Security Blog</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest cybersecurity trends, tutorials, and research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-cyan-500 hover:text-cyan-400"
                >
                  Read more
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}