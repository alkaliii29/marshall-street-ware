import { Order } from '../types';

const ORDERS_STORAGE_KEY = 'marshall_orders_v3';
const ORDERS_EVENT = 'marshall_orders_updated';

// Helper to generate IDs like ORD12345
export function generateOrderId(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `ORD${randomDigits}`;
}

// Realistic seed orders for current month (October 2026) with ORDxxxxx format
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD12901',
    productName: 'Oversized Black Hoodie',
    price: 1299,
    date: '2026-10-01T10:15:00.000Z',
    customerName: 'Aarav Sharma',
    phone: '+91 98201 44521',
    address: 'Flat 402, Sea Green Apts, Bandra West, Mumbai',
    size: 'L',
    status: 'Delivered',
  },
  {
    id: 'ORD12902',
    productName: 'Cargo Pants Olive',
    price: 1499,
    date: '2026-10-01T16:40:00.000Z',
    customerName: 'Rohan Verma',
    phone: '+91 97110 33819',
    address: 'B-14 Hauz Khas Enclave, New Delhi',
    size: '32',
    status: 'Delivered',
  },
  {
    id: 'ORD12903',
    productName: 'Varsity Jacket',
    price: 2999,
    date: '2026-10-02T11:20:00.000Z',
    customerName: 'Kabir Singhania',
    phone: '+91 99401 22890',
    address: 'Villa 12, Palm Meadows, Whitefield, Bengaluru',
    size: 'XL',
    status: 'Delivered',
  },
  {
    id: 'ORD12904',
    productName: 'Graphic Street Tee',
    price: 799,
    date: '2026-10-02T18:05:00.000Z',
    customerName: 'Priya Nair',
    phone: '+91 98450 71234',
    address: '88 Jubilee Hills, Road No. 36, Hyderabad',
    size: 'M',
    status: 'Delivered',
  },
  {
    id: 'ORD12905',
    productName: 'Street Sneakers',
    price: 2499,
    date: '2026-10-03T13:30:00.000Z',
    customerName: 'Vikramaditya Roy',
    phone: '+91 98300 55123',
    address: 'Park Street 14B, Kolkata',
    size: '42',
    status: 'Dispatched',
  },
  {
    id: 'ORD12906',
    productName: 'Denim Jacket Washed',
    price: 2199,
    date: '2026-10-03T19:45:00.000Z',
    customerName: 'Ananya Deshmukh',
    phone: '+91 98220 89110',
    address: 'Koregaon Park Lane 5, Pune',
    size: 'M',
    status: 'Dispatched',
  },
  {
    id: 'ORD12907',
    productName: 'Zip Hoodie Grey',
    price: 1499,
    date: '2026-10-04T09:10:00.000Z',
    customerName: 'Devansh Khanna',
    phone: '+91 98100 66720',
    address: 'Sector 54, Golf Course Road, Gurugram',
    size: 'L',
    status: 'Processing',
  },
  {
    id: 'ORD12908',
    productName: 'Printed Hoodie Beige',
    price: 1399,
    date: '2026-10-04T15:25:00.000Z',
    customerName: 'Siddharth Rao',
    phone: '+91 99800 12345',
    address: 'Indiranagar 100ft Road, Bengaluru',
    size: '34',
    status: 'Processing',
  },
  {
    id: 'ORD12909',
    productName: 'Urban Cap',
    price: 499,
    date: '2026-10-05T08:45:00.000Z',
    customerName: 'Ishaan Malhotra',
    phone: '+91 98711 90812',
    address: 'Greater Kailash 1, New Delhi',
    size: 'ONE SIZE',
    status: 'Processing',
  },
];

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  } catch (err) {
    console.error('Failed to read orders from localStorage:', err);
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent(ORDERS_EVENT, { detail: orders }));
  } catch (err) {
    console.error('Failed to save orders to localStorage:', err);
  }
}

export function addOrder(orderData: Omit<Order, 'id' | 'status'> & { id?: string; status?: Order['status'] }): Order {
  const orders = getStoredOrders();
  const id = orderData.id || generateOrderId();
  const newOrder: Order = {
    ...orderData,
    id,
    status: orderData.status || 'Processing',
    date: orderData.date || new Date().toISOString(),
  };

  const updated = [newOrder, ...orders];
  saveOrders(updated);
  return newOrder;
}

export function deleteOrder(id: string): boolean {
  const orders = getStoredOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  saveOrders(filtered);
  return true;
}

export function resetOrders(): Order[] {
  saveOrders(INITIAL_ORDERS);
  return INITIAL_ORDERS;
}

export function subscribeToOrders(callback: (orders: Order[]) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<Order[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredOrders());
    }
  };

  window.addEventListener(ORDERS_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(ORDERS_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
