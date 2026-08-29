import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, RefreshCw, Github, ArrowLeft, User } from 'lucide-react';
import { ShopifyConfig } from '../types';
import { CollectionsMegaMenu } from './CollectionsMegaMenu';
import { ShopMegaMenu } from './ShopMegaMenu';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenShopifySync: () => void;
  onNavigateHome: () => void;
  onOpenLogin: () => void;
  onNavigateOurStory: () => void;
  shopifyConfig: ShopifyConfig;
  currentView: 'home' | 'product_detail' | 'our_story' | 'blog';
  onOpenBlog: () => void;
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
    
    // Clear and close Shop Menu instantly to prevent overlap buffering
    if (shopOpenTimer.current) clearTimeout(shopOpenTimer.current);
    if (shopCloseTimer.current) clearTimeout(shopCloseTimer.current);
    setIsShopMenuOpen(false);

    if (isMegaMenuOpen) return;
    openTimer.current = setTimeout(() => setIsMegaMenuOpen(true), 70);
  };

  const handleMegaMenuLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (!isMegaMenuOpen) return;
    closeTimer.current = setTimeout(() => setIsMegaMenuOpen(false), 220);
  };

  const handleShopMenuEnter = () => {
    if (shopCloseTimer.current) clearTimeout(shopCloseTimer.current);

    // Clear and close Collections Menu instantly to prevent overlap buffering
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsMegaMenuOpen(false);

    if (isShopMenuOpen) return;
    shopOpenTimer.current = setTimeout(() => setIsShopMenuOpen(true), 70);
  };

  const handleShopMenuLeave = () => {
    if (shopOpenTimer.current) clearTimeout(shopOpenTimer.current);
    if (!isShopMenuOpen) return;
    shopCloseTimer.current = setTimeout(() => setIsShopMenuOpen(false), 220);
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
  const showHeaderStyle = isMegaMenuOpen || isShopMenuOpen || ((currentView === 'product_detail' || isScrolledPastHero) && !isOurStoryView && !isBlogView);
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
      {/* Left nav - SHOP or BACK TO STORE */}
      <div className="flex items-center gap-6 w-1/3">
        {currentView === 'product_detail' || currentView === 'our_story' || currentView === 'blog' ? (
          <button
            onClick={onNavigateHome}
            className="text-sm font-semibold hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div className={`flex items-center gap-6 transition-all duration-300 ${isDropdownOpen ? 'opacity-0 pointer-events-none' : ''}`}>
            <button
              className="text-sm font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity cursor-pointer flex items-center gap-1.5 hidden md:flex"
              onMouseEnter={handleShopMenuEnter}
              onMouseLeave={handleShopMenuLeave}
              onClick={(e) => {
                e.preventDefault();
                setIsShopMenuOpen(!isShopMenuOpen);
              }}
            >
              SHOP
              <span className={`text-[9px] transition-transform duration-300 ${isShopMenuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <button
              className="text-sm font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity cursor-pointer flex items-center gap-1.5 hidden md:flex"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
              onClick={(e) => {
                e.preventDefault();
                setIsMegaMenuOpen(!isMegaMenuOpen);
              }}
            >
              Collections
              <span className={`text-[9px] transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
          </div>
        )}
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
          aria-label="Open menu" 
          aria-expanded={isDropdownOpen}
          aria-controls="sbDrawer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="bars"><i></i><i></i><i></i></span>
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
        onNavigateShop={() => {
          setIsShopMenuOpen(false);
          const el = document.getElementById('products-grid');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
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
      <div className="sb-menu-drawer-top"></div>

      <div className="sb-account">
        <p>To access account and manage orders</p>
        <button 
          className="sb-cta" 
          onClick={() => {
            setIsDropdownOpen(false);
            onOpenLogin();
          }}
        >
          Login / Signup
        </button>
      </div>

      <hr className="sb-rule" />

      <ul className="sb-links">
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(false); }}>
            <span className="txt">Track your order</span>
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
