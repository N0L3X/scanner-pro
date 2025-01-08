import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Shield, Search } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-cyan-500" />
              <span className="font-bold text-xl">CyberArsenal</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/products/digital" className="hover:text-cyan-500 px-3 py-2">Digital Products</Link>
              <Link to="/products/physical" className="hover:text-cyan-500 px-3 py-2">Hardware</Link>
              <Link to="/services" className="hover:text-cyan-500 px-3 py-2">Services</Link>
              <Link to="/blog" className="hover:text-cyan-500 px-3 py-2">Blog</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-800 text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 hover:text-cyan-500" />
              <span className="absolute -top-2 -right-2 bg-cyan-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/products/digital" className="block px-3 py-2 rounded-md hover:bg-gray-700">Digital Products</Link>
            <Link to="/products/physical" className="block px-3 py-2 rounded-md hover:bg-gray-700">Hardware</Link>
            <Link to="/services" className="block px-3 py-2 rounded-md hover:bg-gray-700">Services</Link>
            <Link to="/blog" className="block px-3 py-2 rounded-md hover:bg-gray-700">Blog</Link>
          </div>
        </div>
      )}
    </nav>
  );
}