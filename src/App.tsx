import React, { useState, useEffect } from 'react';
import { Product, CartItem, ShopifyConfig } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { 
  Header, 
  HeroSection, 
  CollectionsCarousel, 
  StatementParticlesSection, 
  OurStorySection, 
  BlogView, 
  FaqView,
  ShopCategoryView,
  CollectionView,
  ProductGrid, 
  ProductDetailView, 
  LoginView, 
  CartDrawer, 
  ShopifySyncModal, 
  CheckoutModal, 
  OrderTrackingModal,
  CustomerOrdersHubModal,
  InstagramFeedSection, 
  Footer 
} from './components';
import { UserProfile } from './components/layout/Header';
import { DesignSystemView } from './design-system/DesignSystemView';
import { fetchProductsFromShopify, createShopifyCheckout } from './lib/shopify';
import { getCollectionById } from './lib/collections';
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

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('spiritbeing_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userData: { name: string; email: string; phone?: string }) => {
    const user: UserProfile = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      ordersCount: 1,
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('spiritbeing_user', JSON.stringify(user));
    } catch {}
    setIsLoginView(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('spiritbeing_user');
    } catch {}
  };

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
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isOrdersHubOpen, setIsOrdersHubOpen] = useState(false);
  const [ordersHubTab, setOrdersHubTab] = useState<'active' | 'history'>('active');
  const [isLoginView, setIsLoginView] = useState(false);
  const [isOurStoryView, setIsOurStoryView] = useState(false);
  const [isBlogView, setIsBlogView] = useState(false);
  const [isFaqView, setIsFaqView] = useState(false);
  const [isDesignSystemView, setIsDesignSystemView] = useState(false);
  const [isShopCategoryView, setIsShopCategoryView] = useState(false);
  const [targetCategorySection, setTargetCategorySection] = useState('top');
  const [isCollectionView, setIsCollectionView] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  const handleNavigateShopCategory = (sectionTarget = 'top') => {
    setSelectedProduct(null);
    setIsOurStoryView(false);
    setIsBlogView(false);
    setIsFaqView(false);
    setIsDesignSystemView(false);
    setIsCollectionView(false);
    setActiveCollectionId(null);
    setTargetCategorySection(sectionTarget);
    setIsShopCategoryView(true);
    if (sectionTarget === 'top') {
      window.scrollTo(0, 0);
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0, { immediate: true });
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleNavigateCollection = (collectionId: string) => {
    if (!getCollectionById(collectionId)) return;
    setSelectedProduct(null);
    setSelectedProductColor(undefined);
    setIsOurStoryView(false);
    setIsBlogView(false);
    setIsFaqView(false);
    setIsDesignSystemView(false);
    setIsShopCategoryView(false);
    setActiveCollectionId(collectionId);
    setIsCollectionView(true);
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  };

  const activeCollection = activeCollectionId ? getCollectionById(activeCollectionId) : undefined;

  const handleNavigateHome = () => {
    const isOnSubPage = selectedProduct || isOurStoryView || isBlogView || isFaqView || isDesignSystemView || isShopCategoryView || isCollectionView;
    if (isOnSubPage) {
      window.scrollTo(0, 0);
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0, { immediate: true });
      }
      setSelectedProduct(null);
      setSelectedProductColor(undefined);
      setIsOurStoryView(false);
      setIsBlogView(false);
      setIsFaqView(false);
      setIsDesignSystemView(false);
      setIsShopCategoryView(false);
      setIsCollectionView(false);
      setActiveCollectionId(null);
    } else if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


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

  // Automatically resize Lenis and refresh GSAP ScrollTrigger when transitioning views
  // to ensure smooth-scroll works perfectly across all pages (Our Story, Blog, Product Details, etc.)
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (lenis) {
      const timer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedProduct, isBlogView, isFaqView, isDesignSystemView, isOurStoryView, isCollectionView, products]);

  // Sync view states to URL hash for shareable links
  useEffect(() => {
    if (selectedProduct) {
      window.location.hash = `product/${selectedProduct.handle}`;
    } else if (isOurStoryView) {
      window.location.hash = 'our-story';
    } else if (isBlogView) {
      window.location.hash = 'blog';
    } else if (isFaqView) {
      window.location.hash = 'faq';
    } else if (isDesignSystemView) {
      window.location.hash = 'design-system';
    } else {
      if (window.location.hash) {
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    }
  }, [selectedProduct, isOurStoryView, isBlogView, isFaqView, isDesignSystemView]);

  // Read URL hash on load/change to render correct view
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product/')) {
        const handle = hash.replace('#product/', '');
        const found = products.find((p) => p.handle === handle);
        if (found) {
          setSelectedProduct(found);
          setIsOurStoryView(false);
          setIsBlogView(false);
          setIsFaqView(false);
          window.scrollTo(0, 0);
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(0, { immediate: true });
          }
        }
      } else if (hash === '#our-story') {
        setIsOurStoryView(true);
        setSelectedProduct(null);
        setIsBlogView(false);
        setIsFaqView(false);
        setIsDesignSystemView(false);
        setIsShopCategoryView(false);
        window.scrollTo(0, 0);
      } else if (hash === '#blog') {
        setIsBlogView(true);
        setSelectedProduct(null);
        setIsOurStoryView(false);
        setIsFaqView(false);
        setIsDesignSystemView(false);
        setIsShopCategoryView(false);
        window.scrollTo(0, 0);
      } else if (hash === '#faq') {
        setIsFaqView(true);
        setSelectedProduct(null);
        setIsOurStoryView(false);
        setIsBlogView(false);
        setIsDesignSystemView(false);
        setIsShopCategoryView(false);
        window.scrollTo(0, 0);
      } else if (hash === '#design-system') {
        setIsDesignSystemView(true);
        setSelectedProduct(null);
        setIsOurStoryView(false);
        setIsBlogView(false);
        setIsFaqView(false);
        setIsShopCategoryView(false);
        window.scrollTo(0, 0);
      } else if (!hash) {
        setSelectedProduct(null);
        setIsOurStoryView(false);
        setIsBlogView(false);
        setIsFaqView(false);
        setIsDesignSystemView(false);
        setIsShopCategoryView(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

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
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const handleScrollToTopCurrentPage = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { duration: 1.2 });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Also scroll any active full-screen overlay scroll elements (e.g. data-lenis-prevent elements)
    const overlayScrolls = document.querySelectorAll('[data-lenis-prevent="true"]');
    overlayScrolls.forEach((el) => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f9] text-[#1b1c1c] selection:bg-black selection:text-white">
      {/* Top Header */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShopifySync={() => setIsShopifySyncOpen(true)}
        onNavigateHome={handleNavigateHome}
        onOpenLogin={() => setIsLoginView(true)}
        onNavigateOurStory={() => {
          setSelectedProduct(null);
          setIsOurStoryView(true);
          setIsBlogView(false);
          setIsFaqView(false);
          setIsShopCategoryView(false);
          window.scrollTo(0, 0);
        }}
        onOpenBlog={() => {
          setSelectedProduct(null);
          setIsOurStoryView(false);
          setIsBlogView(true);
          setIsFaqView(false);
          setIsShopCategoryView(false);
          window.scrollTo(0, 0);
        }}
        onOpenFaq={() => {
          setSelectedProduct(null);
          setIsOurStoryView(false);
          setIsBlogView(false);
          setIsFaqView(true);
          setIsShopCategoryView(false);
          window.scrollTo(0, 0);
        }}
        onNavigateShopCategory={handleNavigateShopCategory}
        onNavigateCollection={handleNavigateCollection}
        shopifyConfig={shopifyConfig}
        currentView={
          isFaqView
            ? 'faq'
            : isBlogView
              ? 'blog'
              : isOurStoryView
                ? 'our_story'
                : isCollectionView
                  ? 'collection'
                  : isShopCategoryView
                    ? 'shop_category'
                    : selectedProduct
                      ? 'product_detail'
                      : 'home'
        }
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenOrdersHub={(tab) => {
          setOrdersHubTab(tab || 'active');
          setIsOrdersHubOpen(true);
        }}
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
            suppressFixedCtas={isCartOpen || isCheckoutOpen}
          />
        ) : isBlogView ? (
          <BlogView onClose={() => setIsBlogView(false)} />
        ) : isFaqView ? (
          <FaqView />
        ) : isDesignSystemView ? (
          <DesignSystemView
            onBack={() => {
              setIsDesignSystemView(false);
              window.history.pushState('', document.title, window.location.pathname + window.location.search);
              window.scrollTo(0, 0);
            }}
          />
        ) : isOurStoryView ? (
          <OurStorySection />
        ) : isShopCategoryView ? (
          <ShopCategoryView
            products={products}
            onSelectProduct={(p, color) => {
              setSelectedProduct(p);
              setSelectedProductColor(color);
              window.scrollTo(0, 0);
            }}
            onNavigateHome={() => {
              setIsShopCategoryView(false);
              window.scrollTo(0, 0);
            }}
            initialSection={targetCategorySection}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />
        ) : isCollectionView && activeCollection ? (
          <CollectionView
            collection={activeCollection}
            products={products}
            onNavigateHome={handleNavigateHome}
            onSelectProduct={(p, color) => {
              setSelectedProduct(p);
              setSelectedProductColor(color);
              setIsCollectionView(false);
              window.scrollTo(0, 0);
            }}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <>
            {/* Cinematic Hero */}
            <HeroSection
              onNavigateShopCategory={handleNavigateShopCategory}
              onNavigateHome={handleNavigateHome}
              onSelectProductByHandle={(handle) => {
                const found = products.find((p) => p.handle === handle);
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

            {/* Sticky Collections Scroll Carousel */}
            <div id="collections-carousel-section">
              <CollectionsCarousel
                products={products}
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
    setIsFaqView(false);
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
        currentUser={currentUser}
        onOpenOrderHub={(tab) => {
          setOrdersHubTab(tab || 'active');
          setIsOrdersHubOpen(true);
        }}
      />

      {/* Rich Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
      />

      {/* Customer Orders, Billing, & Tax Invoice Hub */}
      <CustomerOrdersHubModal
        isOpen={isOrdersHubOpen}
        onClose={() => setIsOrdersHubOpen(false)}
        currentUser={currentUser}
        initialTab={ordersHubTab}
      />

      {/* Editorial Footer */}
      {!isDesignSystemView && (
        <>
          <InstagramFeedSection />
          <Footer
            onScrollToTop={handleScrollToTopCurrentPage}
            onOpenFaq={() => {
              setSelectedProduct(null);
              setIsOurStoryView(false);
              setIsBlogView(false);
              setIsFaqView(true);
              setIsShopCategoryView(false);
              window.scrollTo(0, 0);
            }}
          />
        </>
      )}
    </div>
  );
}
