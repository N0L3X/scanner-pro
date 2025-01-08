import React from 'react';
import { Shield, Lock, Server } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

// Sample featured products
const featuredProducts = [
  {
    id: '1',
    name: 'Advanced Pentesting Suite',
    description: 'Professional-grade penetration testing toolkit with automated vulnerability scanning and reporting.',
    price: 299.99,
    category: 'digital',
    subCategory: 'software',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    rating: 4.8,
    reviews: 156
  },
  {
    id: '2',
    name: 'Raspberry Pi Pentest Kit',
    description: 'Complete hardware kit for wireless penetration testing and network analysis.',
    price: 199.99,
    category: 'physical',
    subCategory: 'hardware',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Enterprise Security Audit',
    description: 'Comprehensive security assessment and penetration testing service for organizations.',
    price: 2499.99,
    category: 'service',
    subCategory: 'consulting',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3',
    rating: 5.0,
    reviews: 42
  }
];

export default function Home() {
  return (
    <div>
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <section className="bg-gray-800 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional Tools</h3>
                <p className="text-gray-400">Industry-standard security tools and hardware for professionals.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-center mb-4">
                  <Lock className="h-12 w-12 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                <p className="text-gray-400">End-to-end encryption and secure payment processing.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-center mb-4">
                  <Server className="h-12 w-12 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                <p className="text-gray-400">24/7 technical support from security professionals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}