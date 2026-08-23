export interface Product {
  id: string;
  shopifyId: string;
  handle: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  category: 'Apparel' | 'Accessories' | 'Home' | 'Goods';
  image: string;
  additionalImages?: string[];
  description: string;
  tagline?: string;
  sizes?: string[];
  colors?: string[];
  color?: string;
  material?: string;
  origin?: string;
  inStock: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
  isConnected: boolean;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface OrderDetails {
  id: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  country: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'card' | 'shoppay' | 'applepay';
  createdAt: string;
}
