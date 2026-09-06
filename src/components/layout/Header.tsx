import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, RefreshCw, Github, ArrowLeft, User } from 'lucide-react';
import { ShopifyConfig } from '../../types';
import { CollectionsMegaMenu } from '../navigation/CollectionsMegaMenu';
import { ShopMegaMenu } from '../navigation/ShopMegaMenu';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  ordersCount?: number;
}

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenShopifySync: () => void;
  onNavigateHome: () => void;
  onOpenLogin: () => void;
  onNavigateOurStory: () => void;
  shopifyConfig: ShopifyConfig;
  currentView: 'home' | 'product_detail' | 'our_story' | 'blog' | 'faq' | 'shop_category';
  onOpenBlog: () => void;
  onOpenFaq: () => void;
  onNavigateShopCategory?: (sectionTarget?: string) => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onOpenOrderTracking?: () => void;
  onOpenOrdersHub?: (tab?: 'active' | 'history') => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenShopifySync,
  onNavigateHome,
  onOpenLogin,
  onNavigateOurStory,
  shopifyConfig,
  currentView,
  onOpenBlog,
  onOpenFaq,
  onNavigateShopCategory,
  currentUser,
  onLogout,
  onOpenOrderTracking,
  onOpenOrdersHub,
}) => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Mega Menu State
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const openTimer = useRef<NodeJS.Timeout | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const shopOpenTimer = useRef<NodeJS.Timeout | null>(null);
  const shopCloseTimer = useRef<NodeJS.Timeout | null>(null);
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);

  const handleMegaMenuEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);

    if (shopOpenTimer.current) clearTimeout(shopOpenTimer.current);
    if (shopCloseTimer.current) clearTimeout(shopCloseTimer.current);
    setIsShopMenuOpen(false);

    if (isMegaMenuOpen) return;
    openTimer.current = setTimeout(() => setIsMegaMenuOpen(true), 45);
  };

  const handleMegaMenuLeave = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (openTimer.current) clearTimeout(openTimer.current);
    if (!isMegaMenuOpen) return;
    closeTimer.current = setTimeout(() => setIsMegaMenuOpen(false), 260);
  };

  const handleShopMenuEnter = () => {
    if (shopCloseTimer.current) clearTimeout(shopCloseTimer.current);

    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsMegaMenuOpen(false);

    if (isShopMenuOpen) return;
    shopOpenTimer.current = setTimeout(() => setIsShopMenuOpen(true), 45);
  };

  const handleShopMenuLeave = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (shopOpenTimer.current) clearTimeout(shopOpenTimer.current);
    if (!isShopMenuOpen) return;
    shopCloseTimer.current = setTimeout(() => setIsShopMenuOpen(false), 260);
  };

  useEffect(() => {
    const handleScroll = () => {
      const enterThreshold = window.innerHeight - 60;
      const exitThreshold = window.innerHeight - 160;

      if (window.scrollY > enterThreshold) {
        setIsScrolledPastHero(true);
      } else if (window.scrollY < exitThreshold) {
        setIsScrolledPastHero(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isDropdownOpen && 
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest('.sb-burger')
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDropdownOpen]);

  useEffect(() => {
    const lenis = (window as any).lenis;
    const mobileMegaOpen = isMegaMenuOpen || isShopMenuOpen;
    const shouldLockScroll = isDropdownOpen || (mobileMegaOpen && window.innerWidth < 768);

    if (shouldLockScroll) {
      document.body.classList.add('menu-open');
      if (lenis) lenis.stop();
    } else {
      document.body.classList.remove('menu-open');
      if (lenis) lenis.start();
    }

    return () => {
      document.body.classList.remove('menu-open');
      if (lenis) lenis.start();
    };
  }, [isDropdownOpen, isMegaMenuOpen, isShopMenuOpen]);

  useEffect(() => {
    if (!isNavigatingHome) return;

    const finishIfAtTop = () => {
      if (window.scrollY < 96) {
        setIsNavigatingHome(false);
      }
    };

    finishIfAtTop();
    window.addEventListener('scroll', finishIfAtTop, { passive: true });
    const timeout = window.setTimeout(() => setIsNavigatingHome(false), 1800);

    return () => {
      window.removeEventListener('scroll', finishIfAtTop);
      window.clearTimeout(timeout);
    };
  }, [isNavigatingHome]);

  const isOurStoryView = currentView === 'our_story';
  const isBlogView = currentView === 'blog';
  const isFaqView = currentView === 'faq';
  const isOnHeroSection =
    currentView === 'home' &&
    !isScrolledPastHero &&
    !isOurStoryView &&
    !isBlogView &&
    !isFaqView &&
    !isNavigatingHome;
  const isMegaOpen = isMegaMenuOpen || isShopMenuOpen;
  
  // Force white header if either mega menu is open (except on hero — glass overlay)
  const showHeaderStyle = isMegaOpen || isNavigatingHome || ((currentView === 'product_detail' || currentView === 'shop_category' || isScrolledPastHero) && !isOurStoryView && !isBlogView && !isFaqView);
  const showCenterLogo =
    isOurStoryView ||
    isBlogView ||
    isFaqView ||
    (showHeaderStyle && !(isOnHeroSection && isMegaOpen));

  const handleNavigateHomeClick = () => {
    setIsMegaMenuOpen(false);
    setIsShopMenuOpen(false);
    setIsDropdownOpen(false);
    setIsNavigatingHome(true);
    onNavigateHome();
  };

  const closeMegaMenus = () => {
    setIsMegaMenuOpen(false);
    setIsShopMenuOpen(false);
  };

  const toggleShopMenu = () => {
    if (shopOpenTimer.current) clearTimeout(shopOpenTimer.current);
    if (shopCloseTimer.current) clearTimeout(shopCloseTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsDropdownOpen(false);
    setIsMegaMenuOpen(false);
    setIsShopMenuOpen((open) => !open);
  };

  const toggleCollectionsMenu = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (shopOpenTimer.current) clearTimeout(shopOpenTimer.current);
    if (shopCloseTimer.current) clearTimeout(shopCloseTimer.current);
    setIsDropdownOpen(false);
    setIsShopMenuOpen(false);
    setIsMegaMenuOpen((open) => !open);
  };

  const scrollToCollectionSlide = (slideIndex: number) => {
    window.dispatchEvent(
      new CustomEvent('sb-go-to-collection-slide', { detail: { slideIndex } })
    );

    const section = document.getElementById('collections-carousel-section');
    if (!section) return;

    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(section);
    } else {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateCollection = (collectionId: string) => {
    closeMegaMenus();

    const liveShopMap: Record<string, string> = {
      essentials: 'tshirts',
      bible: 'tshirts',
    };

    if (liveShopMap[collectionId] && onNavigateShopCategory) {
      onNavigateShopCategory(liveShopMap[collectionId]);
      return;
    }

    const slideMap: Record<string, number> = {
      essentials: 1,
      bible: 0,
      little: 2,
      nomad: 3,
      armoured: 4,
      books: 5,
    };

    const slideIndex = slideMap[collectionId] ?? 0;

    if (currentView !== 'home') {
      onNavigateHome();
      window.setTimeout(() => scrollToCollectionSlide(slideIndex), 150);
      return;
    }

    scrollToCollectionSlide(slideIndex);
  };
  
  const headerBg = isDropdownOpen
    ? 'bg-transparent border-transparent shadow-none'
    : isMegaOpen && isOnHeroSection
    ? 'bg-black/20 backdrop-blur-md border-b border-white/[0.08]'
    : isMegaOpen
    ? 'bg-[#fbf9f9]'
    : (isOurStoryView || isBlogView)
    ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/10 shadow-md'
    : showHeaderStyle || isFaqView
    ? 'bg-[#fbf9f9] drop-shadow-sm'
    : 'bg-transparent';
    
  const textColor =
    isMegaOpen && isOnHeroSection
    ? 'text-white'
    : isMegaOpen
    ? 'text-black'
    : (isOurStoryView || isBlogView) ? 'text-white' : (showHeaderStyle || isFaqView) ? 'text-black' : 'text-white';

  const cornerColor = isDropdownOpen
    ? 'text-transparent'
    : (isMegaMenuOpen || isShopMenuOpen)
    ? 'text-transparent' // Hide inverted corners when mega menu drops down to prevent them cutting into the panel
    : (isOurStoryView || isBlogView)
    ? 'text-[#080808]/90'
    : showHeaderStyle || isFaqView
    ? 'text-[#fbf9f9]'
    : 'text-transparent';

  const getDrawerGreeting = () => {
    if (!currentUser?.name?.trim()) return 'Hey Spirit Being';
    const firstName = currentUser.name.trim().split(/\s+/)[0];
    return `Hey ${firstName}`;
  };

  const isMenuPanelOpen = isMegaOpen;

  return (
    <>
    <header className={`fixed top-0 left-0 w-full z-[90] flex justify-between items-center px-5 md:px-12 py-2 md:py-2 ${isOnHeroSection ? 'sb-header--hero' : ''} ${isMenuPanelOpen ? 'sb-header--mega-open' : ''} ${!isMenuPanelOpen ? 'transition-[background-color,color,box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]' : ''} ${headerBg} ${textColor}`}>
      {/* Left nav — mobile plain links + desktop mega menus */}
      <div className="flex items-center gap-4 md:gap-6 md:w-1/3">
        <div className={`flex md:hidden items-center gap-3 transition-all duration-300 ${isDropdownOpen ? 'opacity-0 pointer-events-none' : ''}`}>
          <button
            type="button"
            className={`sb-nav-trigger sb-nav-trigger--mobile ${isShopMenuOpen ? 'is-active' : ''}`}
            aria-expanded={isShopMenuOpen}
            aria-haspopup="true"
            onClick={toggleShopMenu}
          >
            Shop
            <span className="sb-chevron">▼</span>
          </button>
          <button
            type="button"
            className={`sb-nav-trigger sb-nav-trigger--mobile ${isMegaMenuOpen ? 'is-active' : ''}`}
            aria-expanded={isMegaMenuOpen}
            aria-haspopup="true"
            onClick={toggleCollectionsMenu}
          >
            Collections
            <span className="sb-chevron">▼</span>
          </button>
        </div>

        <div className={`hidden md:flex items-center gap-2 md:gap-4 transition-all duration-300 ${isDropdownOpen ? 'opacity-0 pointer-events-none' : ''}`}>
          <div
            className="sb-nav-item hidden md:block"
            onMouseEnter={handleShopMenuEnter}
            onMouseLeave={handleShopMenuLeave}
          >
            <button
              type="button"
              className={`sb-nav-trigger ${isShopMenuOpen ? 'is-active' : ''}`}
              aria-expanded={isShopMenuOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.preventDefault();
                setIsShopMenuOpen(!isShopMenuOpen);
                setIsMegaMenuOpen(false);
              }}
            >
              SHOP
              <span className="sb-chevron">▼</span>
            </button>
          </div>
          <div
            className="sb-nav-item hidden md:block"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
          >
            <button
              type="button"
              className={`sb-nav-trigger ${isMegaMenuOpen ? 'is-active' : ''}`}
              aria-expanded={isMegaMenuOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.preventDefault();
                setIsMegaMenuOpen(!isMegaMenuOpen);
                setIsShopMenuOpen(false);
              }}
            >
              Collections
              <span className="sb-chevron">▼</span>
            </button>
          </div>
        </div>
      </div>

      {/* Center Logo — desktop / scrolled only */}
      <div className="hidden md:flex w-1/3 justify-center text-center items-center">
        <button
          type="button"
          onClick={handleNavigateHomeClick}
          className={`transition-opacity duration-300 cursor-pointer hover:opacity-70 ${
            showCenterLogo
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <img 
            src={(isOurStoryView || isBlogView) ? "/assets/img_logo_white.png" : "/sb-blue-header.png"} 
            alt="Spirit Being Logo" 
            className="h-[22px] md:h-[28px] object-contain" 
          />
        </button>
      </div>

      {/* Right nav — tablet/desktop: text links · mobile: cart icon + burger */}
      <div className="flex justify-end items-center gap-1 md:gap-6 md:w-1/3 relative">
        <button
          onClick={onNavigateOurStory}
          className={`hidden md:block text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity duration-300 cursor-pointer ${isDropdownOpen ? 'opacity-0 pointer-events-none' : ''}`}
        >
          OUR STORY
        </button>
        <button
          onClick={onOpenCart}
          className={`hidden md:block text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity duration-300 cursor-pointer ${isDropdownOpen ? 'opacity-0 pointer-events-none' : ''}`}
        >
          CART ({cartCount})
        </button>

        <button
          type="button"
          onClick={onOpenCart}
          className={`sb-mobile-cart md:hidden ${isDropdownOpen ? 'is-menu-open' : ''}`}
          aria-label={cartCount > 0 ? `Open cart, ${cartCount} items` : 'Open cart'}
        >
          <ShoppingBag size={18} strokeWidth={1.65} aria-hidden="true" />
          {cartCount > 0 && (
            <span className="sb-mobile-cart-badge" aria-hidden="true">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>

        <button 
          className="sb-burger md:ml-0" 
          type="button"
          aria-label={isDropdownOpen ? 'Close menu' : 'Open menu'} 
          aria-expanded={isDropdownOpen}
          aria-controls="sbDrawer"
          onClick={() => {
            closeMegaMenus();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <span className="bars"><i></i><i></i></span>
        </button>
      </div>

      {/* Inverted Corner - Left */}
      <svg 
        className={`absolute top-full left-0 w-6 h-6 ${isMenuPanelOpen ? '' : 'transition-all duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)]'} ${cornerColor}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M 0 0 H 24 A 24 24 0 0 0 0 24 V 0 Z" />
      </svg>

      {/* Inverted Corner - Right */}
      <svg 
        className={`absolute top-full right-0 w-6 h-6 ${isMenuPanelOpen ? '' : 'transition-all duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)]'} ${cornerColor}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M 0 0 H 24 V 24 A 24 24 0 0 0 0 0 Z" />
      </svg>

      {/* Mega Menu */}
      <CollectionsMegaMenu 
        isOpen={isMegaMenuOpen} 
        isHeroContext={isOnHeroSection}
        onClose={() => setIsMegaMenuOpen(false)}
        onMouseEnter={handleMegaMenuEnter}
        onMouseLeave={handleMegaMenuLeave}
        onNavigateCollection={handleNavigateCollection}
      />
      <ShopMegaMenu
        isOpen={isShopMenuOpen}
        isHeroContext={isOnHeroSection}
        onClose={() => setIsShopMenuOpen(false)}
        onMouseEnter={handleShopMenuEnter}
        onMouseLeave={handleShopMenuLeave}
        onNavigateShop={(sectionTarget) => {
          setIsShopMenuOpen(false);
          if (onNavigateShopCategory) {
            onNavigateShopCategory(sectionTarget);
          } else {
            const el = document.getElementById('products-grid');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
      />
      
    </header>

    {/* Scrim Overlay */}
    <div 
      className={`sb-menu-scrim ${isDropdownOpen ? 'is-open' : ''}`} 
      onClick={() => setIsDropdownOpen(false)}
    />
    
    {/* Menu Drawer */}
    <aside
      id="sbDrawer"
      ref={dropdownRef}
      className={`sb-menu-drawer ${isDropdownOpen ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="sb-drawer-head">
        <p className="sb-drawer-greeting">{getDrawerGreeting()}</p>
        {!currentUser && (
          <p className="sb-drawer-subline">Track orders, saves, and your Spirit Being profile.</p>
        )}
      </div>

      {!currentUser ? (
        <button
          type="button"
          className="sb-drawer-auth-cta"
          onClick={() => {
            setIsDropdownOpen(false);
            onOpenLogin();
          }}
        >
          Login / Signup
        </button>
      ) : (
        <div className="sb-drawer-user">
          <div className="sb-drawer-user-main">
            <div className="sb-drawer-avatar" aria-hidden="true">
              {currentUser.name
                ? currentUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                : 'SB'}
            </div>
            <div className="sb-drawer-user-meta">
              <span className="sb-drawer-user-name">{currentUser.name}</span>
              <span className="sb-drawer-user-email">{currentUser.email}</span>
            </div>
          </div>
          <button
            type="button"
            className="sb-drawer-signout"
            onClick={() => onLogout?.()}
          >
            Sign out
          </button>
        </div>
      )}

      <hr className="sb-rule" />

      <ul className="sb-links">
        {currentUser && (
          <li className="sb-drawer-order-pill">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen(false);
                if (onOpenOrdersHub) {
                  onOpenOrdersHub('active');
                } else {
                  onOpenOrderTracking?.();
                }
              }}
            >
              <span className="sb-drawer-order-label">Active order · #SB-10492</span>
              <span className="sb-drawer-order-detail">Spirit Gives Life Tee · Out for delivery</span>
            </a>
          </li>
        )}
        <li className="md:hidden">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(false);
              onNavigateOurStory();
            }}
          >
            <span className="txt">Our Story</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(false);
              if (currentUser) {
                if (onOpenOrdersHub) {
                  onOpenOrdersHub('history');
                } else {
                  onOpenOrderTracking?.();
                }
              } else {
                onOpenLogin();
              }
            }}
          >
            <span className="txt">{currentUser ? 'My orders & receipts' : 'Track your order'}</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(false); }}>
            <span className="txt">Returns &amp; exchanges</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(false); }}>
            <span className="txt">Support</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(false); onOpenBlog(); }}>
            <span className="txt">Blog</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(false); onOpenFaq(); }}>
            <span className="txt">FAQ</span>
          </a>
        </li>
      </ul>

      <hr className="sb-rule sb-rule--before-foot" />

      <div className="sb-foot">
        <div className="sb-touch">
          <span>Get in touch</span>
          <a href="mailto:hello@spiritbeing.in">hello@spiritbeing.in</a>
        </div>
      </div>
    </aside>
    </>
  );
};
