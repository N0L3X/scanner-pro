import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:transform group-hover:scale-105">
        <div className="relative h-48">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.category === 'digital' && (
            <span className="absolute top-2 right-2 bg-cyan-500 text-white px-2 py-1 rounded text-sm">
              Digital
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-cyan-500 font-bold">
              {product.price.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
              })}
            </span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-gray-400 text-sm ml-1">{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}