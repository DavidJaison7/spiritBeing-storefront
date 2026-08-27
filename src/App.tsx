import React, { useState, useEffect } from 'react';
import { Product, CartItem, ShopifyConfig } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CollectionsCarousel } from './components/CollectionsCarousel';
import { StatementParticlesSection } from './components/StatementParticlesSection';
import { OurStorySection } from './components/OurStorySection';
import { BlogView } from './components/BlogView';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailView } from './components/ProductDetailView';
import { LoginView } from './components/LoginView';
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
  const [selectedProductColor, setSelectedProductColor] = useState<string | undefined>(undefined);

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spiritbeing_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem('spiritbeing_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

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
  const [isLoginView, setIsLoginView] = useState(false);
  const [isOurStoryView, setIsOurStoryView] = useState(false);
  const [isBlogView, setIsBlogView] = useState(false);

  // Bottom strip visibility (Only in Hero and Collections Carousel till end of 6th slide)
  const [showBottomStrip, setShowBottomStrip] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (selectedProduct || isOurStoryView || isBlogView) {
        setShowBottomStrip(false);
        return;
      }

      const carouselElem = document.getElementById('collections-carousel-section');
      if (carouselElem) {
        const rect = carouselElem.getBoundingClientRect();
        // Keep fixed bottom strip active while in Hero or anywhere in Collections Carousel till end of 6th slide
        // Hides immediately as soon as StatementParticlesSection enters from bottom of window
        setShowBottomStrip(rect.bottom > window.innerHeight + 20);
      } else {
        setShowBottomStrip(window.scrollY < window.innerHeight * 5.5);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedProduct, isOurStoryView, isBlogView]);

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
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    (window as any).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);

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

  if (isLoginView) {
    return (
      <LoginView
        onNavigateHome={() => {
          setIsLoginView(false);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f9] text-[#1b1c1c] selection:bg-black selection:text-white">
      {/* Top Header */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShopifySync={() => setIsShopifySyncOpen(true)}
        onNavigateHome={() => {
          setSelectedProduct(null);
          setIsOurStoryView(false);
          setIsBlogView(false);
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(0, { duration: 1.2 });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenLogin={() => setIsLoginView(true)}
        onNavigateOurStory={() => {
          setSelectedProduct(null);
          setIsOurStoryView(true);
          setIsBlogView(false);
          window.scrollTo(0, 0);
        }}
        onOpenBlog={() => {
          setSelectedProduct(null);
          setIsOurStoryView(false);
          setIsBlogView(true);
          window.scrollTo(0, 0);
        }}
        shopifyConfig={shopifyConfig}
        currentView={
          isBlogView ? 'blog' : isOurStoryView ? 'our_story' : selectedProduct ? 'product_detail' : 'home'
        }
      />

      {/* Main View switching */}
      <main className="flex-grow">
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            initialColor={selectedProductColor}
            allProducts={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onBackToShop={() => {
              setSelectedProduct(null);
              setSelectedProductColor(undefined);
            }}
            onSelectProduct={(p, color) => {
              setSelectedProduct(p);
              setSelectedProductColor(color);
              window.scrollTo(0, 0);
              if ((window as any).lenis) {
                (window as any).lenis.scrollTo(0, { immediate: true });
              }
            }}
            onAddToCart={handleAddToCart}
          />
        ) : isBlogView ? (
          <BlogView onClose={() => setIsBlogView(false)} />
        ) : isOurStoryView ? (
          <OurStorySection />
        ) : (
          <>
            {/* Cinematic Hero */}
            <HeroSection
              products={products}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setSelectedProductColor(undefined);
                window.scrollTo(0, 0);
              }}
            />

            {/* Sticky Collections Scroll Carousel */}
            <div id="collections-carousel-section">
              <CollectionsCarousel
                onSelectProductByHandle={(handle) => {
                  const found = products.find(p => p.handle === handle);
                  if (found) {
                    setSelectedProduct(found);
                    setSelectedProductColor(undefined);
                    window.scrollTo(0, 0);
                    if ((window as any).lenis) {
                      (window as any).lenis.scrollTo(0, { immediate: true });
                    }
                  }
                }}
              />
            </div>

            {/* Statement Particles Section */}
            <StatementParticlesSection />

            {/* Product Grid */}
            <ProductGrid
              products={products}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={(p, color) => {
                setSelectedProduct(p);
                setSelectedProductColor(color);
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
        products={products}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setIsCartOpen(false);
        }}
        onShopNow={() => {
          setSelectedProduct(null);
          setIsOurStoryView(false);
          setIsBlogView(false);
          setIsCartOpen(false);
          setTimeout(() => {
            const el = document.getElementById('products-grid') || document.getElementById('product-grid');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              if ((window as any).lenis) {
                (window as any).lenis.scrollTo(el);
              }
            }
          }, 150);
        }}
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

      {/* Global Transparent Fixed Bottom Strip (Only in Hero & Collections Carousel) */}
      {!selectedProduct && !isOurStoryView && !isBlogView && showBottomStrip && (
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
          <span>Only at spiritbeinggen.com</span>
        </footer>
      )}
    </div>
  );
}
