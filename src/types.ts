export type CollectionStatus = 'live' | 'coming-soon';

export interface Collection {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: CollectionStatus;
  /** Full-bleed banner on collection page */
  heroImage: string;
  /** Mega menu tile image */
  megaMenuImage: string;
  /** CSS grid tile class in CollectionsMegaMenu.css */
  megaMenuTileClass: string;
  sortOrder: number;
  /** Shopify Admin product tag, e.g. sb-collection:essentials */
  shopifyTag: string;
  isBlueTile?: boolean;
  chips?: string[];
}

export interface Product {
  id: string;
  shopifyId: string;
  handle: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  category: 'Apparel' | 'Accessories' | 'Home' | 'Goods';
  /** Editorial collection (one per product). Set via Shopify tag sb-collection:{id} */
  collectionId?: string;
  image: string;
  additionalImages?: string[];
  colorImageMap?: Record<string, string[]>;
  description: string;
  tagline?: string;
  sizes?: string[];
  colors?: string[];
  color?: string;
  material?: string;
  origin?: string;
  inStock: boolean;
  isFeatured?: boolean;
  likesCount?: number;
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
