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
  currentView: 'home' | 'product_detail' | 'our_story' | 'blog' | 'shop_category';
  onOpenBlog: () => void;
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

  const handleMegaMenuEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);

    if (shopOpenTimer.current) clearTimeout(shopOpenTimer.current);
    if (shopCloseTimer.current) clearTimeout(shopCloseTimer.current);
    setIsShopMenuOpen(false);

    if (isMegaMenuOpen) return;
    openTimer.current = setTimeout(() => setIsMegaMenuOpen(true), 45);
  };

  const handleMegaMenuLeave = () => {
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
    if (shopOpenTimer.current) clearTimeout(shopOpenTimer.current);
    if (!isShopMenuOpen) return;
    shopCloseTimer.current = setTimeout(() => setIsShopMenuOpen(false), 260);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 50) {
        setIsScrolledPastHero(true);
      } else {
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
    if (isDropdownOpen) {
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
  }, [isDropdownOpen]);

  const isOurStoryView = currentView === 'our_story';
  const isBlogView = currentView === 'blog';
  
  // Force white header if either mega menu is open
  const showHeaderStyle = isMegaMenuOpen || isShopMenuOpen || ((currentView === 'product_detail' || currentView === 'shop_category' || isScrolledPastHero) && !isOurStoryView && !isBlogView);
  const showLogo = showHeaderStyle || isOurStoryView || isBlogView;
  
  const headerBg = isDropdownOpen
    ? 'bg-transparent border-transparent shadow-none'
    : (isMegaMenuOpen || isShopMenuOpen)
    ? 'bg-[#fbf9f9]' // Remove drop shadow so it blends perfectly with the mega menu
    : (isOurStoryView || isBlogView)
    ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/10 shadow-md'
    : showHeaderStyle
    ? 'bg-[#fbf9f9] drop-shadow-sm'
    : 'bg-transparent';
    
  const textColor = (isMegaMenuOpen || isShopMenuOpen)
    ? 'text-black'
    : (isOurStoryView || isBlogView) ? 'text-white' : showHeaderStyle ? 'text-black' : 'text-white';

  const cornerColor = isDropdownOpen
    ? 'text-transparent'
    : (isMegaMenuOpen || isShopMenuOpen)
    ? 'text-transparent' // Hide inverted corners when mega menu drops down to prevent them cutting into the panel
    : (isOurStoryView || isBlogView)
    ? 'text-[#080808]/90'
    : showHeaderStyle
    ? 'text-[#fbf9f9]'
    : 'text-transparent';

  return (
    <>
    <header className={`fixed top-0 left-0 w-full z-[90] flex justify-between items-center px-6 md:px-12 py-1.5 md:py-2 transition-all duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${headerBg} ${textColor}`}>
      {/* Left nav - SHOP and COLLECTIONS */}
      <div className="flex items-center gap-6 w-1/3">
        <div className={`flex items-center gap-2 md:gap-4 transition-all duration-300 ${isDropdownOpen ? 'opacity-0 pointer-events-none' : ''}`}>
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

      {/* Center Logo */}
      <div className="w-1/3 flex justify-center text-center items-center">
        <button
          onClick={onNavigateHome}
          className={`transition-all duration-300 cursor-pointer hover:opacity-70 ${
            showLogo
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <img 
            src={(isOurStoryView || isBlogView) ? "/assets/img_logo_white.png" : "/sb-blue-header.png"} 
            alt="Spirit Being Logo" 
            className="h-[22px] md:h-[28px] object-contain" 
          />
        </button>
      </div>

      {/* Right nav - OUR STORY, BLOG, CART, MENU */}
      <div className="w-1/3 flex justify-end items-center gap-4 md:gap-6 relative">
        <button
          onClick={onNavigateOurStory}
          className={`hidden md:block text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity duration-300 cursor-pointer ${isDropdownOpen ? 'opacity-0 pointer-events-none' : ''}`}
        >
          OUR STORY
        </button>
        <button
          onClick={onOpenCart}
          className={`text-xs font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity duration-300 cursor-pointer ${isDropdownOpen ? 'opacity-0 pointer-events-none' : ''}`}
        >
          CART ({cartCount})
        </button>
        
        {/* Toggle Dropdown Menu (Animated Burger) */}
        <button 
          className="sb-burger" 
          type="button"
          aria-label={isDropdownOpen ? 'Close menu' : 'Open menu'} 
          aria-expanded={isDropdownOpen}
          aria-controls="sbDrawer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="bars"><i></i><i></i></span>
        </button>
      </div>

      {/* Inverted Corner - Left */}
      <svg 
        className={`absolute top-full left-0 w-6 h-6 transition-all duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${cornerColor}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M 0 0 H 24 A 24 24 0 0 0 0 24 V 0 Z" />
      </svg>

      {/* Inverted Corner - Right */}
      <svg 
        className={`absolute top-full right-0 w-6 h-6 transition-all duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${cornerColor}`} 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M 0 0 H 24 V 24 A 24 24 0 0 0 0 0 Z" />
      </svg>

      {/* Mega Menu */}
      <CollectionsMegaMenu 
        isOpen={isMegaMenuOpen} 
        onClose={() => setIsMegaMenuOpen(false)}
        onMouseEnter={handleMegaMenuEnter}
        onMouseLeave={handleMegaMenuLeave}
      />
      <ShopMegaMenu
        isOpen={isShopMenuOpen}
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
      ref={dropdownRef}
      className={`sb-menu-drawer ${isDropdownOpen ? 'is-open' : ''}`} 
      role="dialog" 
      aria-modal="true" 
      aria-label="Menu"
    >
      <div className={`sb-account ${currentUser ? 'sb-account--signed-in' : ''}`}>
        {currentUser ? (
          <>
            <div className="sb-account-main">
              <div className="sb-account-avatar" aria-hidden="true">
                {currentUser.name
                  ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : 'SB'}
              </div>
              <div className="sb-account-meta">
                <span className="sb-account-name">{currentUser.name}</span>
                <span className="sb-account-email">{currentUser.email}</span>
              </div>
            </div>
            <button
              type="button"
              className="sb-account-logout"
              onClick={() => {
                onLogout?.();
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p>To access account and manage orders</p>
            <button 
              className="sb-cta cursor-pointer" 
              onClick={() => {
                setIsDropdownOpen(false);
                onOpenLogin();
              }}
            >
              Login / Signup
            </button>
          </>
        )}
      </div>

      <hr className="sb-rule" />

      <ul className="sb-links">
        {currentUser && (
          <li className="bg-[#0B3DFF]/5 rounded-xl p-3 mb-3 border border-[#0B3DFF]/15 hover:bg-[#0B3DFF]/10 transition-colors">
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
              className="flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#0B3DFF] font-bold uppercase tracking-wider block">Active Order #SB-10492</span>
                <span className="text-xs font-mono text-[#1b1c1c] font-semibold">Spirit Gives Life Tee • Out for Delivery</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-2"></span>
            </a>
          </li>
        )}
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
            <span className="txt">{currentUser ? 'My Orders & Receipts' : 'Track your order'}</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(false); }}>
            <span className="txt">Returns &amp; Exchanges</span>
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
          <a href="#" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(false); }}>
            <span className="txt">FAQ</span>
          </a>
        </li>
      </ul>

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
