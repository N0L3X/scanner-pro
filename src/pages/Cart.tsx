import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, X, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { shippingMethods } from '../data/shipping';
import { paymentMethods } from '../data/payment';

export default function Cart() {
  const { state, dispatch } = useCart();
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0].id);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const selectedShippingMethod = shippingMethods.find(m => m.id === selectedShipping);
  const total = state.total + (selectedShippingMethod?.price || 0);

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Ihr Warenkorb ist leer</h1>
            <p className="text-gray-400 mb-8">Stöbern Sie in unseren Produkten.</p>
            <Link
              to="/products/digital"
              className="inline-block bg-cyan-500 text-white py-2 px-6 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Produkte durchsuchen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Warenkorb</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {state.items.map((item) => (
              <div
                key={item.product.id}
                className="bg-gray-800 rounded-lg p-6 mb-4 flex items-center"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="ml-6 flex-grow">
                  <h3 className="text-lg font-semibold text-white">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-400">{item.product.category}</p>
                  <div className="mt-2 flex items-center">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-4 text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="ml-6 flex flex-col items-end">
                  <span className="text-lg font-semibold text-white">
                    {item.product.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </span>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="mt-2 text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Versandoptionen */}
            <div className="bg-gray-800 rounded-lg p-6 mt-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Versandoptionen
              </h3>
              <div className="space-y-4">
                {shippingMethods.map((method) => (
                  <label key={method.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedShipping === method.id}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="form-radio text-cyan-500 focus:ring-cyan-500"
                    />
                    <div className="flex-grow">
                      <p className="text-white">{method.name}</p>
                      <p className="text-sm text-gray-400">
                        Lieferzeit: {method.estimatedDays} Werktage
                      </p>
                    </div>
                    <span className="text-white">
                      {method.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Zahlungsoptionen */}
            <div className="bg-gray-800 rounded-lg p-6 mt-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Zahlungsarten
              </h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="form-radio text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-white">{method.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-white mb-4">Zusammenfassung</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-400">
                <span>Zwischensumme</span>
                <span>{state.total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Versand</span>
                <span>{selectedShippingMethod?.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between text-white font-semibold">
                  <span>Gesamtsumme</span>
                  <span>{total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">inkl. 19% MwSt.</p>
              </div>
              <button className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors">
                Zur Kasse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}