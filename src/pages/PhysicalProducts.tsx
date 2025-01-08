import React from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const physicalProducts: Product[] = [
  {
    id: 'pp1',
    name: 'Professional Pentesting Kit',
    description: 'Complete Raspberry Pi-based pentesting kit with custom OS and accessories.',
    price: 299.99,
    category: 'physical',
    subCategory: 'hardware',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    rating: 4.9,
    reviews: 89
  },
  {
    id: 'pp2',
    name: 'WiFi Penetration Testing Bundle',
    description: 'High-gain antenna and specialized adapters for wireless network testing.',
    price: 119.99,
    category: 'physical',
    subCategory: 'hardware',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 'pp3',
    name: 'Advanced RFID Testing Kit',
    description: 'Professional RFID reader and cloner with frequency analysis capabilities.',
    price: 189.99,
    category: 'physical',
    subCategory: 'hardware',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    rating: 4.7,
    reviews: 92
  }
];

export default function PhysicalProducts() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Security Hardware</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional-grade security hardware and pentesting equipment for security professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {physicalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}