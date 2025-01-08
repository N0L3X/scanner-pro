// Add to existing types.ts
export type ShippingMethod = {
  id: string;
  name: string;
  carrier: string;
  price: number;
  estimatedDays: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'paypal' | 'klarna' | 'sofort';
  icon: string;
};