import React, { useState, useEffect } from 'react';
import { Product, CartItem, ShopifyConfig } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StatementDiscordSection } from './components/StatementDiscordSection';
import { CollectionsCarousel } from './components/CollectionsCarousel';
import { OurStorySection } from './components/OurStorySection';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { ShopifySyncModal } from './components/ShopifySyncModal';
import { CheckoutModal } from './components/CheckoutModal';
import { InstagramFeedSection } from './components/InstagramFeedSection';
import { Footer } from './components/Footer';
import { fetchProductsFromShopify, createShopifyCheckout } from './lib/shopify';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('spiritbeing_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShopifySyncOpen, setIsShopifySyncOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Shopify configuration
  const [shopifyConfig, setShopifyConfig] = useState<ShopifyConfig>(() => {
    try {
      const saved = localStorage.getItem('spiritbeing_shopify_config');
      return saved
        ? JSON.parse(saved)
        : {
            storeDomain: 'spiritbeing-studio.myshopify.com',
            storefrontAccessToken: '',
            apiVersion: '2024-04',
            isConnected: false,
            autoSync: true,
          };
    } catch {
      return {
        storeDomain: 'spiritbeing-studio.myshopify.com',
        storefrontAccessToken: '',
        apiVersion: '2024-04',
        isConnected: false,
        autoSync: true,
      };
    }
  });

  // Global Lenis Smooth Scroll
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    (window as any).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('spiritbeing_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart:', err);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('spiritbeing_shopify_config', JSON.stringify(shopifyConfig));
    } catch (err) {
      console.error('Failed to save shopify config:', err);
    }
  }, [shopifyConfig]);

  useEffect(() => {
    async function loadShopifyProducts() {
      /* TEMPORARILY DISABLED TO SHOW 7 ARCHIVE IMAGES
      if (shopifyConfig.isConnected && shopifyConfig.storeDomain && shopifyConfig.storefrontAccessToken) {
        setIsLoadingProducts(true);
        const shopifyProducts = await fetchProductsFromShopify(
          shopifyConfig.storeDomain,
          shopifyConfig.storefrontAccessToken,
          shopifyConfig.apiVersion
        );
        if (shopifyProducts.length > 0) {
          setProducts(shopifyProducts);
        }
        setIsLoadingProducts(false);
      }
      */
    }
    loadShopifyProducts();
  }, [shopifyConfig.isConnected, shopifyConfig.storeDomain, shopifyConfig.storefrontAccessToken, shopifyConfig.apiVersion]);

  // Cart handlers
  const handleAddToCart = (product: Product, size: string, color?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, selectedSize: size, selectedColor: color, quantity: 1 }];
      }
    });
    setTimeout(() => {
      setIsCartOpen(true);
    }, 900);
  };

  const handleUpdateQuantity = (productId: string, size: string, color: string | undefined, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string, size: string, color: string | undefined) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f9] text-[#1b1c1c] selection:bg-black selection:text-white">
      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShopifySync={() => setIsShopifySyncOpen(true)}
        onNavigateHome={() => {
          setSelectedProduct(null);
          window.scrollTo(0, 0);
        }}
        shopifyConfig={shopifyConfig}
        currentView={selectedProduct ? 'product_detail' : 'home'}
      />

      {/* Main View switching */}
      <main className="flex-grow">
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            onBackToShop={() => setSelectedProduct(null)}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo(0, 0);
              if ((window as any).lenis) {
                (window as any).lenis.scrollTo(0, { immediate: true });
              }
            }}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <>
            {/* Cinematic Hero */}
            <HeroSection
              products={products}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                window.scrollTo(0, 0);
              }}
            />

            {/* Statement & Discord Community Section */}
            <StatementDiscordSection />

            {/* Sticky Collections Scroll Carousel */}
            <CollectionsCarousel />

            {/* Our Story Section */}
            <OurStorySection />

            {/* Product Grid */}
            <ProductGrid
              products={products}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                window.scrollTo(0, 0);
              }}
              onAddToCart={handleAddToCart}
            />
          </>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={async () => {
          if (shopifyConfig.isConnected && shopifyConfig.storeDomain && shopifyConfig.storefrontAccessToken) {
            const checkoutUrl = await createShopifyCheckout(
              shopifyConfig.storeDomain,
              shopifyConfig.storefrontAccessToken,
              shopifyConfig.apiVersion,
              cart
            );
            if (checkoutUrl) {
              window.location.href = checkoutUrl;
              return;
            } else {
              alert('Failed to create Shopify checkout. Falling back to local checkout.');
            }
          }
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Shopify Data Sync Modal */}
      <ShopifySyncModal
        isOpen={isShopifySyncOpen}
        onClose={() => setIsShopifySyncOpen(false)}
        products={products}
        shopifyConfig={shopifyConfig}
        onUpdateConfig={setShopifyConfig}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onClearCart={handleClearCart}
      />

      {/* Editorial Footer */}
      <InstagramFeedSection />
      <Footer />

      {/* Global Transparent Fixed Bottom Strip */}
      <footer className="fixed-bottom-strip">
        <span className="left">
          <span className="ticks">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </span>
          Faith. Identity. Purpose.
        </span>
        <span>Only at spiritbeing.in</span>
      </footer>
    </div>
  );
}
