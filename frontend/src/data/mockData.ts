export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  rating: number;
  imageUrl: string;
  imageUrls: string[];
}

export interface Store {
  id: string;
  storeName: string;
  description: string;
  logoUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  deliveryRadiusKm: number;
  rating: number;
  isOpen: boolean;
  estimatedDeliveryTimeMinutes: number;
  distanceKm: number;
  coverUrl: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
}

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Fresh Fruits', imageUrl: '🍒' },
  { id: 'cat-2', name: 'Bakery', imageUrl: '🥐' },
  { id: 'cat-3', name: 'Dairy & Eggs', imageUrl: '🥛' },
  { id: 'cat-4', name: 'Meat & Seafood', imageUrl: '🥩' },
  { id: 'cat-5', name: 'Gourmet Treats', imageUrl: '🍩' },
  { id: 'cat-6', name: 'Beverages', imageUrl: '🥤' }
];

export const STORES: Store[] = [
  {
    id: 'store-1',
    storeName: 'Organic Oasis & Orchard',
    description: 'Fresh farm-to-table organic produce, hand-picked fruits, and custom greens.',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    address: '452 Pine Valley Road, Silicon Valley',
    latitude: 37.7749,
    longitude: -122.4194,
    deliveryRadiusKm: 5,
    rating: 4.9,
    isOpen: true,
    estimatedDeliveryTimeMinutes: 18,
    distanceKm: 0.8
  },
  {
    id: 'store-2',
    storeName: 'Le Petit Boulangerie',
    description: 'Artisanal sourdough, croissants, and fine pastries baked fresh daily.',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    address: '88 Croissant Lane, Presidio Heights',
    latitude: 37.7891,
    longitude: -122.4014,
    deliveryRadiusKm: 8,
    rating: 4.8,
    isOpen: true,
    estimatedDeliveryTimeMinutes: 25,
    distanceKm: 1.4
  },
  {
    id: 'store-3',
    storeName: 'Neptunes Sea & Premium Meats',
    description: 'Fresh ocean catches, prime cut dry-aged steaks, and organic poultry.',
    logoUrl: 'https://images.unsplash.com/photo-1534124414827-1429f19d997d?w=100&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1534124414827-1429f19d997d?w=800&auto=format&fit=crop&q=80',
    address: '101 Fisherman Wharf, Marina District',
    latitude: 37.7649,
    longitude: -122.4394,
    deliveryRadiusKm: 4,
    rating: 4.7,
    isOpen: true,
    estimatedDeliveryTimeMinutes: 30,
    distanceKm: 2.1
  },
  {
    id: 'store-4',
    storeName: 'Dairy Queen & Cheese Emporium',
    description: 'Imported cheeses, grass-fed butter, fresh farm milk, and organic yogurts.',
    logoUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80',
    address: '12 Milkway Avenue, Pacific Heights',
    latitude: 37.7958,
    longitude: -122.4284,
    deliveryRadiusKm: 6,
    rating: 4.9,
    isOpen: false,
    estimatedDeliveryTimeMinutes: 22,
    distanceKm: 1.9
  }
];

export const PRODUCTS: Product[] = [
  // Store 1 Products
  {
    id: 'prod-1',
    vendorId: 'store-1',
    categoryId: 'cat-1',
    name: 'Organic Red Cherries',
    description: 'Sweet, juicy organic cherries freshly harvested from local valley orchards.',
    price: 8.99,
    stock: 24,
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-2',
    vendorId: 'store-1',
    categoryId: 'cat-1',
    name: 'Farm Fresh Strawberries',
    description: 'Vibrant organic strawberries perfect for breakfast or healthy snacks.',
    price: 5.49,
    stock: 8, // Low Stock Alert
    isAvailable: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-3',
    vendorId: 'store-1',
    categoryId: 'cat-1',
    name: 'Honeycrisp Apples',
    description: 'Crisp, sweet, and slightly tart organic apples fresh from Washington growers.',
    price: 3.99,
    stock: 45,
    isAvailable: true,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80'
    ]
  },

  // Store 2 Products
  {
    id: 'prod-4',
    vendorId: 'store-2',
    categoryId: 'cat-2',
    name: 'Artisanal Sourdough Batard',
    description: 'Sourdough loaf baked with 24-hour slow fermented wild yeast starter.',
    price: 7.50,
    stock: 12,
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&auto=format&fit=crop&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-5',
    vendorId: 'store-2',
    categoryId: 'cat-2',
    name: 'Golden French Croissant',
    description: 'Flaky, buttery multi-layered traditional French breakfast pastries.',
    price: 3.80,
    stock: 30,
    isAvailable: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80'
    ]
  },

  // Store 3 Products
  {
    id: 'prod-6',
    vendorId: 'store-3',
    categoryId: 'cat-4',
    name: 'Wild Caught Sockeye Salmon Fillet',
    description: 'Fresh sockeye salmon rich in Omega-3, sourced sustainably from Alaska.',
    price: 24.99,
    stock: 5, // Low stock
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prod-7',
    vendorId: 'store-3',
    categoryId: 'cat-4',
    name: 'Prime Ribeye Steak (300g)',
    description: 'Premium cut dry-aged prime beef steak with excellent marbling and flavor.',
    price: 32.50,
    stock: 15,
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80'
    ]
  },

  // Store 4 Products (Dairy)
  {
    id: 'prod-8',
    vendorId: 'store-4',
    categoryId: 'cat-3',
    name: 'Aged Truffle Cheddar Cheese',
    description: 'Traditional mature English cheddar cheese infused with luxury black summer truffle.',
    price: 14.20,
    stock: 10,
    isAvailable: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=500&auto=format&fit=crop&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=500&auto=format&fit=crop&q=80'
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'HC-2026-000001',
    createdAt: '2026-07-16T14:32:00Z',
    totalAmount: 26.78,
    status: 'Delivered',
    paymentStatus: 'Paid',
    shippingAddress: '100 Infinity Loop, Cupertino, CA',
    paymentMethod: 'Apple Pay',
    items: [
      { id: 'oi-1', productId: 'prod-1', productName: 'Organic Red Cherries', quantity: 2, price: 8.99 },
      { id: 'oi-2', productId: 'prod-3', productName: 'Honeycrisp Apples', quantity: 2, price: 3.99 }
    ]
  },
  {
    id: 'ord-2',
    orderNumber: 'HC-2026-000002',
    createdAt: '2026-07-17T09:12:00Z',
    totalAmount: 18.80,
    status: 'OutForDelivery',
    paymentStatus: 'Paid',
    shippingAddress: '100 Infinity Loop, Cupertino, CA',
    paymentMethod: 'Apple Pay',
    items: [
      { id: 'oi-3', productId: 'prod-4', productName: 'Artisanal Sourdough Batard', quantity: 1, price: 7.50 },
      { id: 'oi-4', productId: 'prod-2', productName: 'Farm Fresh Strawberries', quantity: 2, price: 5.49 }
    ]
  }
];

export const SALES_CHART_DATA = [
  { name: 'Jan', revenue: 4200, orders: 120 },
  { name: 'Feb', revenue: 5100, orders: 154 },
  { name: 'Mar', revenue: 7400, orders: 204 },
  { name: 'Apr', revenue: 6900, orders: 189 },
  { name: 'May', revenue: 9500, orders: 240 },
  { name: 'Jun', revenue: 12500, orders: 310 },
  { name: 'Jul', revenue: 14800, orders: 345 }
];
