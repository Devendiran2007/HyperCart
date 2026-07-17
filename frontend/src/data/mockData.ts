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
  isVerified?: boolean;
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
  { id: 'cat-6', name: 'Beverages', imageUrl: '🥤' },
  { id: 'cat-7', name: 'Fashion & Wear', imageUrl: '👕' },
  { id: 'cat-8', name: 'Home & Furniture', imageUrl: '🛋️' }
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
    distanceKm: 0.8,
    isVerified: true
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
    distanceKm: 1.4,
    isVerified: true
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
    distanceKm: 2.1,
    isVerified: true
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
    distanceKm: 1.9,
    isVerified: false
  },
  {
    id: 'store-5',
    storeName: 'Gourmet Glaze Donuts',
    description: 'Luxury artisanal donuts, hot brews, and sweet confections.',
    logoUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80',
    address: '9 Sugar Way, Union Square',
    latitude: 37.7852,
    longitude: -122.4082,
    deliveryRadiusKm: 5,
    rating: 4.6,
    isOpen: true,
    estimatedDeliveryTimeMinutes: 15,
    distanceKm: 1.1,
    isVerified: false
  },
  {
    id: 'store-6',
    storeName: 'Greenery Juice & Health Bar',
    description: 'Cold-pressed wellness juices, organic superfood smoothies, and acai bowls.',
    logoUrl: 'https://images.unsplash.com/photo-1628557006841-496a71b560df?w=100&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1628557006841-496a71b560df?w=800&auto=format&fit=crop&q=80',
    address: '32 Fit Lane, Mission District',
    latitude: 37.7599,
    longitude: -122.4148,
    deliveryRadiusKm: 7,
    rating: 4.8,
    isOpen: true,
    estimatedDeliveryTimeMinutes: 20,
    distanceKm: 1.6,
    isVerified: true
  },
  {
    id: 'store-7',
    storeName: 'Threads & Co. Boutique',
    description: 'Handcrafted premium clothing, linen shirts, and minimalist wardrobe essentials.',
    logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    address: '77 Fashion Boulevard, Silicon Valley',
    latitude: 37.7812,
    longitude: -122.4112,
    deliveryRadiusKm: 10,
    rating: 4.8,
    isOpen: true,
    estimatedDeliveryTimeMinutes: 35,
    distanceKm: 2.4,
    isVerified: true
  },
  {
    id: 'store-8',
    storeName: 'Nordic Loft Furniture',
    description: 'Sleek Scandinavian furniture, oak work desks, and ambient architectural lighting.',
    logoUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=100&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80',
    address: '108 Design District, San Francisco',
    latitude: 37.7712,
    longitude: -122.4042,
    deliveryRadiusKm: 15,
    rating: 4.9,
    isOpen: true,
    estimatedDeliveryTimeMinutes: 45,
    distanceKm: 3.8,
    isVerified: true
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
    stock: 8,
    isAvailable: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80']
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
    imageUrls: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80']
  },
  {
    id: 'prod-3b',
    vendorId: 'store-1',
    categoryId: 'cat-3',
    name: 'Organic Pasture Eggs',
    description: 'Free-range brown eggs laid by grass-fed chickens on our local partner farms.',
    price: 6.20,
    stock: 35,
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80']
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
    imageUrls: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80']
  },
  {
    id: 'prod-5b',
    vendorId: 'store-2',
    categoryId: 'cat-2',
    name: 'Pain au Chocolat',
    description: 'Classic dark chocolate stuffed flaky sweet puff pastry loaf.',
    price: 4.20,
    stock: 25,
    isAvailable: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=80']
  },

  // Store 3 Products
  {
    id: 'prod-6',
    vendorId: 'store-3',
    categoryId: 'cat-4',
    name: 'Wild Caught Sockeye Salmon Fillet',
    description: 'Fresh sockeye salmon rich in Omega-3, sourced sustainably from Alaska.',
    price: 24.99,
    stock: 5,
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80']
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
    imageUrls: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80']
  },

  // Store 4 Products
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
    imageUrls: ['https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=500&auto=format&fit=crop&q=80']
  },
  {
    id: 'prod-9',
    vendorId: 'store-4',
    categoryId: 'cat-3',
    name: 'Organic Whole Milk',
    description: 'Pasteurized whole milk rich in nutrients, bottled locally from grass-fed cows.',
    price: 4.80,
    stock: 40,
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80']
  },

  // Store 5 Products (Donuts)
  {
    id: 'prod-10',
    vendorId: 'store-5',
    categoryId: 'cat-5',
    name: 'Classic Velvet Glazed Donut',
    description: 'Our signature melt-in-the-mouth yeast raised donut topped with vanilla sugar glaze.',
    price: 3.20,
    stock: 60,
    isAvailable: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=80']
  },
  {
    id: 'prod-11',
    vendorId: 'store-5',
    categoryId: 'cat-6',
    name: 'Cold Brew Macchiato',
    description: 'Double espresso pulled slow over ice, layered with sweetened cold milk foam.',
    price: 5.10,
    stock: 50,
    isAvailable: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80']
  },

  // Store 6 Products (Juice Health)
  {
    id: 'prod-12',
    vendorId: 'store-6',
    categoryId: 'cat-6',
    name: 'Supergreen Detox Juice',
    description: 'Cold-pressed spinach, green apple, cucumber, ginger, celery, and key lime juices.',
    price: 7.90,
    stock: 35,
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1628557006841-496a71b560df?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1628557006841-496a71b560df?w=500&auto=format&fit=crop&q=80']
  },

  // Store 7 Products (Threads & Co. Clothing Boutique)
  {
    id: 'prod-13',
    vendorId: 'store-7',
    categoryId: 'cat-7',
    name: 'Premium Linen Resort Shirt',
    description: 'Breathable, relaxed-fit resort shirt woven from organic French flax linen.',
    price: 58.00,
    stock: 15,
    isAvailable: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80']
  },
  {
    id: 'prod-14',
    vendorId: 'store-7',
    categoryId: 'cat-7',
    name: 'Oversized Loopback Hoodie',
    description: 'Heavyweight organic cotton loopback French terry hoodie in stone grey.',
    price: 75.00,
    stock: 22,
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80']
  },
  {
    id: 'prod-15',
    vendorId: 'store-7',
    categoryId: 'cat-7',
    name: 'Classic White Knit Tee',
    description: 'Ultra-soft combed long-staple cotton crewneck tee with a clean tailored hem.',
    price: 28.00,
    stock: 40,
    isAvailable: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80']
  },

  // Store 8 Products (Nordic Loft Scandinavian Furniture)
  {
    id: 'prod-16',
    vendorId: 'store-8',
    categoryId: 'cat-8',
    name: 'Minimalist Oak Writing Desk',
    description: 'Solid oak workspace desk featuring clean lines, integrated wire grommets, and smooth sliders.',
    price: 349.00,
    stock: 4,
    isAvailable: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=80']
  },
  {
    id: 'prod-17',
    vendorId: 'store-8',
    categoryId: 'cat-8',
    name: 'Ergonomic Mesh Chair',
    description: 'Office desk chair with adjustable lumbar support, 3D armrests, and high-performance mesh backing.',
    price: 210.00,
    stock: 8,
    isAvailable: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=80']
  },
  {
    id: 'prod-18',
    vendorId: 'store-8',
    categoryId: 'cat-8',
    name: 'Frosted Glass Table Lamp',
    description: 'A beautiful architectural spherical light source providing soft ambient workspace illumination.',
    price: 49.00,
    stock: 15,
    isAvailable: true,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80']
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
  },
  {
    id: 'ord-3',
    orderNumber: 'HC-2026-000003',
    createdAt: '2026-07-17T10:45:00Z',
    totalAmount: 43.80,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    shippingAddress: '100 Infinity Loop, Cupertino, CA',
    paymentMethod: 'Apple Pay',
    items: [
      { id: 'oi-5', productId: 'prod-7', productName: 'Prime Ribeye Steak (300g)', quantity: 1, price: 32.50 },
      { id: 'oi-6', productId: 'prod-11', productName: 'Cold Brew Macchiato', quantity: 2, price: 5.10 }
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
