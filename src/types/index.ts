export interface Product {
  id: string;
  name: string;
  price: number; // in INR (₹)
  image: string;
  category: 'Hoodies' | 'Outerwear' | 'Pants' | 'T-Shirts' | 'Footwear' | 'Accessories';
  description: string;
  details: string[];
  sizes: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  stock: number;
  sku: string;
  createdAt: string;
}

export interface Order {
  id: string;
  productName: string;
  productId?: string;
  price: number; // in INR (₹)
  date: string; // ISO date string e.g. "2026-10-04"
  customerName: string;
  phone: string;
  address: string;
  size?: string;
  status: 'Delivered' | 'Processing' | 'Dispatched';
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
  submessage?: string;
}

export type AdminTab = 'dashboard' | 'products' | 'analytics';

export type PageRoute = 
  | { view: 'home' }
  | { view: 'product'; productId: string }
  | { view: 'wishlist' }
  | { view: 'admin'; adminTab?: AdminTab };

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
