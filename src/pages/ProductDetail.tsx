import React from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Star, Package, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

// In a real app, this would come from an API
const getProduct = (id: string): Product | undefined => {
  const allProducts = [
    // Digital Products
    {
      id: 'dp1',
      name: 'Advanced Network Scanner Pro',
      description: 'Professional network vulnerability scanner with automated reporting and CVE database integration.',
      longDescription: 'Our Advanced Network Scanner Pro is a comprehensive security tool designed for professional penetration testers and security analysts. It provides deep network insights, vulnerability assessment, and automated reporting capabilities.',
      price: 149.99,
      category: 'digital',
      subCategory: 'software',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
      rating: 4.8,
      reviews: 127,
      features: [
        'Automated vulnerability scanning',
        'CVE database integration',
        'Custom exploit development framework',
        'Advanced reporting system',
        'API integration capabilities',
        'Regular security updates'
      ],
      specifications: {
        'License Type': 'Perpetual',
        'Updates': '1 year included',
        'Support': '24/7 email support',
        'Platform': 'Windows, Linux, macOS'
      }
    },
    // Add more products here
  ];
  
  return allProducts.find(p => p.id === id);
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const product = getProduct(id || '');

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Product not found</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-xl"
            />
            {product.category === 'digital' && (
              <span className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm">
                Digital Product
              </span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400 ml-2">
                ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-cyan-500 mb-6">
              €{product.price.toLocaleString()}
            </p>

            <p className="text-gray-300 mb-6">{product.longDescription}</p>

            <div className="space-y-4 mb-8">
              {product.features?.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Shield className="h-5 w-5 text-cyan-500 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {product.specifications && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="text-gray-300">
                      <span className="font-medium text-white">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full bg-cyan-500 text-white py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center"
            >
              <Package className="h-5 w-5 mr-2" />
              Add to Cart
            </button>

            {product.category === 'physical' && (
              <div className="mt-4 flex items-center text-gray-400">
                <Truck className="h-5 w-5 mr-2" />
                Free shipping worldwide
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}