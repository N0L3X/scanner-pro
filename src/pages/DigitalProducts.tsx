import React from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const digitalProducts: Product[] = [
  {
    id: 'dp1',
    name: 'Advanced Network Scanner Pro',
    description: 'Professional network vulnerability scanner with automated reporting and CVE database integration.',
    price: 149.99,
    category: 'digital',
    subCategory: 'software',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    rating: 4.8,
    reviews: 127
  },
  {
    id: 'dp2',
    name: 'OSINT Masterclass 2024',
    description: 'Comprehensive online course covering advanced OSINT techniques and tools.',
    price: 299.99,
    category: 'digital',
    subCategory: 'course',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    rating: 4.9,
    reviews: 234
  },
  {
    id: 'dp3',
    name: 'Social Engineering Toolkit',
    description: 'Advanced phishing simulation and awareness training platform.',
    price: 129.99,
    category: 'digital',
    subCategory: 'software',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f',
    rating: 4.7,
    reviews: 156
  }
];

export default function DigitalProducts() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Digital Security Products</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional-grade cybersecurity tools, courses, and digital resources for security experts and organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {digitalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}