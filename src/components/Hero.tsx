import React from 'react';
import { Shield, Lock, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Professional</span>
                <span className="block text-cyan-500">Cybersecurity Tools</span>
              </h1>
              <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Equip yourself with cutting-edge security tools, hardware, and expertise. From penetration testing to secure infrastructure - we've got you covered.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <Link
                  to="/products/digital"
                  className="rounded-md shadow px-8 py-3 bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors"
                >
                  Browse Products
                </Link>
                <Link
                  to="/services"
                  className="mt-3 sm:mt-0 sm:ml-3 rounded-md shadow px-8 py-3 bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
                >
                  Our Services
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gray-800 sm:h-72 md:h-96 lg:w-full lg:h-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
          <img
            className="w-full h-full object-cover opacity-50"
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
            alt="Cybersecurity"
          />
        </div>
      </div>
    </div>
  );
}